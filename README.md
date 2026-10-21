# 🎯 AI-Powered Resume Matching & Job Recommendation System

An intelligent web platform that bridges the gap between job seekers and recruiters using semantic AI matching. The system parses resumes, evaluates candidate qualifications against real-time job postings, computes multidimensional similarity scores, and surfaces actionable profile recommendations.

---

## 📌 Features

### 👤 For Candidates / Job Seekers
* **Resume Parsing & Ingestion:** Upload resumes in PDF or DOCX formats with automated extraction of skills, work history, and education.
* **Semantic Job Matching:** Context-aware matching beyond simple keyword searches to surface the most relevant positions.
* **Skill Gap Analysis:** Highlights missing tools, certifications, or competencies required for target job descriptions.
* **Application Dashboard:** Track applied positions, match scores, and interview statuses in real time.

### 🏢 For Recruiters / Employers
* **Job Posting Management:** Create, update, and manage detailed job specifications with required and preferred skill tags.
* **Automated Candidate Ranking:** Automatically sort and filter incoming applicant pools by relevance and suitability scores.
* **Resume Screening Workflow:** View parsed candidate summaries and skill overviews without manual document parsing.

---

## 🛠️ System Architecture & Tech Stack

* **Frontend:** React.js, Tailwind CSS, Axios, Lucide React
* **Backend:** Python, Django / Django REST Framework
* **Database:** PostgreSQL / SQLite
* **AI & NLP Pipeline:**
  * **Text Extraction:** `PyPDF2` / `pdfplumber` / `python-docx`
  * **Embeddings & LLM:** Grok API / Sentence-Transformers (`all-MiniLM-L6-v2`)
  * **Similarity Computation:** Cosine Similarity / FAISS vector indexing
* **Authentication:** JWT (JSON Web Tokens)

---

## ⚙️ Project Structure

```text
├── backend/
│   ├── manage.py
│   ├── authentication/       # User auth & profile management
│   ├── jobs/                 # Job listings, categories, and applications
│   ├── matching_engine/      # Resume parsing, embedding generation, scoring logic
│   └── core/                 # Project settings and root URL routing
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Modals, Cards)
│   │   ├── pages/            # Dashboard, JobDetails, UploadResume, RecruiterPortal
│   │   ├── context/          # Auth and global application state
│   │   └── services/         # API integration with Axios
│   └── package.json
└── README.md
