import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";

const TextFormatInTag = ({ name, initialValue, handleChange, onBlur }) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleEditorChange = () => {
    const content = editorRef.current.getContent();
    setValue(content);
    if (handleChange) {
      handleChange(content, name);
    }
  };

  const handleEditorBlur = () => {
    if (onBlur) {
      onBlur({ target: { value, name } });
    }
  };

  return (
    <>
      <Editor
        apiKey='7cn0s3sy89eycfjccfl2vqcvcy469bewfc9l05evzgc672zi'
        onInit={(e, editor) => editorRef.current = editor}
        initialValue={initialValue}
        onChange={handleEditorChange}
        onBlur={handleEditorBlur}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </>
  );
}

export default TextFormatInTag;
