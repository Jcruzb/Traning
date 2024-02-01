
import DOMPurify from 'dompurify';

const TextFormatToShowInCourseContent = ({ htmlContent }) => {
    const sanitizedHTML = DOMPurify.sanitize(htmlContent);

    return (
        <div
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        style={{

            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 1,
            textOverflow: 'ellipsis'
        }}    
        ></div>
    );
};

export default TextFormatToShowInCourseContent;
