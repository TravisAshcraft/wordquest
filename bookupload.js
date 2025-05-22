document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('book-form');
    const generateBtn = document.getElementById('generate-btn');
    const generatedFields = document.getElementById('generated-fields');

    generateBtn.addEventListener('click', async () => {
        const title = form.title.value.trim();
        const author = form.author.value.trim();

        if (!title) {
            alert('Please enter a book title.');
            return;
        }

        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;

        try {
            const res = await fetch('http://localhost:6969/api/books/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author })
            });

            const data = await res.json();

            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }

            form.point_value.value = data.point_value || '';
            form.word_count.value = data.word_count || '';
            form.genre.value = data.genre || '';
            form.quiz_json.value = JSON.stringify(data.quiz_json, null, 2);
            generatedFields.style.display = 'block';

        } catch (err) {
            console.error('Failed to generate:', err);
            alert('Something went wrong while generating.');
        } finally {
            generateBtn.textContent = 'Generate Details';
            generateBtn.disabled = false;
        }
    });
});
