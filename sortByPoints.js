//Creates a button in ClassDojo's classroom view to allow you to sort students by points from highest to lowest.

(function() {
    'use strict';

    // 1. Create and Style the Sort Button
    const sortBtn = document.createElement('button');
    sortBtn.innerText = 'Sort by #'; // Shorter Label
    Object.assign(sortBtn.style, {
        position: 'fixed',
        bottom: '80px', // Positioned higher to avoid overlap
        right: '20px',
        zIndex: '9999',
        padding: '10px 20px',
        backgroundColor: '#059dff',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        fontWeight: 'bold',
        fontSize: '14px'
    });
    document.body.appendChild(sortBtn);

    const sortStudents = () => {
        const studentButtons = document.querySelectorAll('button[data-name="studentTile"]');
        if (studentButtons.length === 0) return;

        const container = studentButtons[0].closest('li').parentNode;
        
        // Target the "Add students" button specifically to exclude it
        const addStudentBtn = document.querySelector('button[aria-label="Add students"]');
        const addStudentTile = addStudentBtn ? addStudentBtn.closest('li') : null;

        const studentArray = Array.from(studentButtons)
            .filter(btn => {
                // Ignore the "Add students" button in the sorting array
                return btn.getAttribute('aria-label') !== "Add students";
            })
            .map(btn => ({
                element: btn.closest('li'),
                points: calculateTotalPoints(btn.getAttribute('aria-label'))
            }));

        // Sort descending: Highest points to lowest
        studentArray.sort((a, b) => b.points - a.points);

        // Re-append sorted students
        studentArray.forEach(item => {
            if (item.element) container.appendChild(item.element);
        });

        // Ensure "Add Students" is the absolute last element
        if (addStudentTile) {
            container.appendChild(addStudentTile);
        }

        console.log("✅ Sort complete.");
    };

    const calculateTotalPoints = (label) => {
        if (!label) return 0;
        
        // Handles "positive: X, negative: Y"
        const posMatch = label.match(/positive:\s*(\d+)/i);
        const negMatch = label.match(/negative:\s*(-?\d+)/i);
        if (posMatch || negMatch) {
            return (posMatch ? parseInt(posMatch[1], 10) : 0) + (negMatch ? parseInt(negMatch[1], 10) : 0);
        }
        
        // Handles "X points"
        const singleMatch = label.match(/(-?\d+)\s+points/i);
        return singleMatch ? parseInt(singleMatch[1], 10) : 0;
    };

    sortBtn.addEventListener('click', sortStudents);
})();
