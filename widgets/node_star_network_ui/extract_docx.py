import docx

def read_docx(path):
    doc = docx.Document(path)
    text = []
    for para in doc.paragraphs:
        text.append(para.text)
    
    with open("docx_text.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(text))

if __name__ == "__main__":
    read_docx("GCI_Node_Star_Analysis_Diagrams(1).docx")
