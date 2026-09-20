import fitz
import sys

def extract_pdf(path):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    with open("pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)

def main():
    pdf_path = "AI_Native_Infrastructure_for_Ecosystem_Automation__Fintech_Integration__and_Global_Hub_Connectivity__3_-5.pdf"
    extract_pdf(pdf_path)

if __name__ == "__main__":
    main()
