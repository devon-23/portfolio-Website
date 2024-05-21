// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('.terminal .content p.typewriter'); // Target only <p> tags with class 'typewriter' within .terminal .content
    elements.forEach(el => {
        let text = el.textContent;
        el.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    });
});
