//This js script will fade a student's avatar when you give them points. This will allow you to visualize students who did not get any points that session.

(function() {
    'use strict';

    // 1. Memory to store the opacity for each student by name
    const studentMemory = {};

    console.log("🚀 ClassDojo Script: Persistent Name-Tracking Active");

    const setupStudent = (button) => {
        // 2. Extract the first two words (Student Name) to use as a unique key
        const label = button.getAttribute('aria-label') || "";
        const nameParts = label.trim().split(/\s+/);
        const studentName = nameParts.slice(0, 2).join(' ');

        if (!studentName || button.dataset.observed === 'true') return;
        button.dataset.observed = 'true';

        const parentLi = button.closest('li');
        if (parentLi) {
            // 3. Restore opacity from memory, or default to 1.0
            if (studentMemory[studentName] === undefined) {
                studentMemory[studentName] = 1.0;
            }

            parentLi.style.transition = 'opacity 0.5s ease';
            parentLi.style.opacity = studentMemory[studentName].toString();
        }

        let isProcessing = false;
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'aria-label' && !isProcessing) {
                    if (parentLi) {
                        isProcessing = true;
                        
                        // 4. Calculate and save the new opacity to the student's name
                        let current = studentMemory[studentName];
                        let next = Math.max(0.25, current - 0.25);
                        
                        studentMemory[studentName] = next;
                        parentLi.style.opacity = next.toString();
                        
                        console.log(`📉 Point for ${studentName}: Reduced to ${next}`);
                        
                        // Prevent the script from double-counting the update
                        setTimeout(() => { isProcessing = false; }, 250);
                    }
                }
            }
        });

        observer.observe(button, { attributes: true, attributeFilter: ['aria-label'] });
    };

    // 5. Observe the body for new students (handles ClassDojo re-renders)
    const pageObserver = new MutationObserver(() => {
        const buttons = document.querySelectorAll('button[data-name="studentTile"]');
        buttons.forEach(setupStudent);
    });

    pageObserver.observe(document.body, { childList: true, subtree: true });
})();
