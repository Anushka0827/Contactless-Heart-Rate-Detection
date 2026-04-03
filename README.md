# PulseGuard: Contact-Free Cardiac Stress Monitoring via Facial Video

PulseGuard extracts heart rate, heart rate variability, and cardiac stress indicators from standard camera footage of a person's face. It uses remote photoplethysmography (rPPG) to detect the subtle skin color fluctuations caused by blood flow, then processes that signal through a multi-region, multi-algorithm fusion pipeline with built-in signal quality assessment.

The system is designed for environments where wearable sensors are unavailable: disaster triage, remote telehealth, low-resource clinics, and mass screening scenarios.

## Core Capabilities

- **Heart Rate (BPM)** extraction from 30-second facial video or live webcam
- **Inter-Beat Interval (IBI)** waveform visualization
- **HRV Metrics**: RMSSD, SDNN, pNN50, LF/HF ratio
- **Stress Classification**: three-tier (Low / Moderate / High) based on HRV feature analysis
- **Signal Quality Index (SQI)**: composite confidence score that suppresses output when the measurement is unreliable
- **Multi-ROI Adaptive Fusion**: independent signal extraction from forehead and both cheeks, weighted by per-region quality

## Architecture Overview

```
Video Input --> Face Mesh Detection --> Multi-ROI Green Channel Extraction
    --> POS + CHROM Signal Processing --> Ensemble Fusion (SNR-weighted)
    --> Signal Quality Assessment --> BPM / IBI Extraction
    --> HRV Analysis --> Stress Classification --> Dashboard Output
```

The pipeline is modular: each stage communicates through well-defined data structures (see `src/models.py`) and can be developed, tested, and replaced independently.

## Project Structure

```
src/
    models.py               Shared data structures used across all modules
    roi_extractor.py         Face detection and multi-ROI green channel extraction
    signal_processor.py      POS and CHROM rPPG algorithms with bandpass filtering
    ensemble.py              Multi-algorithm, multi-ROI weighted signal fusion
    sqi_engine.py            Signal quality scoring (SNR, kurtosis, spectral purity)
    hrv_analyzer.py          HRV metric computation from IBI data
    stress_classifier.py     Stress level classification from HRV features
    api/
        main.py              FastAPI server with video upload and analysis endpoints

frontend/
    index.html               Dashboard layout
    style.css                Styling and visual design
    app.js                   Client logic, API calls, chart rendering

tests/
    unit/                    Per-module unit tests
    api/                     API endpoint contract tests
    integration/             End-to-end pipeline tests
    fixtures/                Test data (synthetic signals, sample frames)

docs/modules/               Detailed development guide per module
scripts/                    Utility scripts (video recording, data prep)
demo_videos/                Pre-recorded clips for demo and testing
notebooks/                  Exploratory analysis and prototyping
```

## Quick Start

### Prerequisites

- Python 3.9+
- pip
- A webcam or a pre-recorded face video (30 seconds, 30fps preferred)

### Installation

```bash
git clone https://github.com/Priyank-Adhav/Contactless-Heart-Rate-Detection.git
cd Contactless-Heart-Rate-Detection

python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
pip install -r requirements-dev.txt   # for testing
```

### Running the Server

```bash
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

Then open `http://localhost:8000` in your browser.

### Running Tests

```bash
# All tests
pytest tests/ -v

# Unit tests only (fast)
pytest tests/unit/ -v

# With coverage report
pytest tests/ -v --cov=src --cov-report=term-missing
```

## Module Documentation

Each module has a dedicated development guide in `docs/modules/`:

| Module | Guide | Owner |
|--------|-------|-------|
| ROI Extraction | [01_roi_extraction.md](docs/modules/01_roi_extraction.md) | P1 |
| Signal Processing | [02_signal_processing.md](docs/modules/02_signal_processing.md) | P2 |
| Signal Quality | [03_sqi_engine.md](docs/modules/03_sqi_engine.md) | P1 |
| HRV Analysis | [04_hrv_analysis.md](docs/modules/04_hrv_analysis.md) | P3 |
| Stress Classification | [05_stress_classification.md](docs/modules/05_stress_classification.md) | P3 |
| API Server | [06_api_server.md](docs/modules/06_api_server.md) | P3 |
| Frontend Dashboard | [07_frontend_dashboard.md](docs/modules/07_frontend_dashboard.md) | P4 |

## Signal Processing Approach

PulseGuard uses an ensemble of two established rPPG methods:

- **POS (Plane Orthogonal to Skin)**: projects RGB channels onto a plane orthogonal to the skin-tone direction, effectively isolating the blood volume pulse from motion and illumination artifacts.
- **CHROM (Chrominance-based)**: uses a chrominance model to separate the pulsatile component from specular reflections and ambient light variation.

Both methods run independently on each of three facial ROIs (forehead, left cheek, right cheek), producing six candidate signals. These are fused using SNR-weighted averaging, where each candidate's contribution is proportional to its measured signal quality.

## Signal Quality Index

The SQI engine computes a composite score from three metrics:

| Metric | Weight | Purpose |
|--------|--------|---------|
| Spectral SNR | 0.50 | Ratio of cardiac-band power to total signal power |
| Kurtosis | 0.25 | Detects non-physiological amplitude distributions |
| Spectral Purity | 0.25 | Penalizes broad, noisy frequency peaks |

When the composite score drops below a threshold, the system suppresses BPM output entirely and displays a quality warning. This prevents the system from presenting unreliable measurements as valid readings.

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Face Detection | MediaPipe Face Mesh | 468 landmarks, robust across angles and skin tones |
| Image Processing | OpenCV | Standard, well-documented |
| Signal Processing | SciPy, NumPy | FFT, filtering, peak detection |
| HRV Analysis | NeuroKit2 | Validated, publication-grade HRV computation |
| Web Server | FastAPI + Uvicorn | Async support, automatic OpenAPI docs |
| Frontend | HTML / CSS / JavaScript | No build step, full design control |
| Charts | Chart.js | Lightweight, good waveform rendering |
| Testing | pytest | Industry standard |

## References

- Wang, W., den Brinker, A. C., Stuijk, S., & de Haan, G. (2017). Algorithmic Principles of Remote PPG. IEEE TBME.
- de Haan, G., & Jeanne, V. (2013). Robust Pulse Rate from Chrominance-Based rPPG. IEEE TBME.
- Boccignone, G., et al. (2022). pyVHR: a Python framework for remote photoplethysmography. PeerJ Computer Science.
- Makowski, D., et al. (2021). NeuroKit2: A Python toolbox for neurophysiological signal processing.

## License

MIT License. See [LICENSE](LICENSE) for details.
