// ==========================================
// EMAILJS CONFIGURATION
// ==========================================

// Replace these with your EmailJS information

const PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const SERVICE_ID = "YOUR_SERVICE_ID";
const TEMPLATE_ID = "YOUR_TEMPLATE_ID";


// ==========================================
// WAIT FOR PAGE TO LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Check that EmailJS exists
    if (typeof emailjs === "undefined") {

        console.error("EmailJS is not loaded.");

        return;
    }


    // Initialize EmailJS
    emailjs.init({
        publicKey: PUBLIC_KEY
    });


    // ==========================================
    // ELEMENTS
    // ==========================================

    const stars = document.querySelectorAll("#stars i");

    const nameInput =
        document.getElementById("name");

    const commentInput =
        document.getElementById("comment");

    const submitButton =
        document.getElementById("submitReview");

    const reviewsList =
        document.getElementById("reviewsList");


    // Check required elements
    if (
        !nameInput ||
        !commentInput ||
        !submitButton
    ) {

        console.error(
            "Review form elements are missing from HTML."
        );

        return;
    }


    // ==========================================
    // STAR RATING
    // ==========================================

    let selectedRating = 0;


    stars.forEach(function (star) {

        star.addEventListener("click", function () {

            selectedRating =
                Number(this.dataset.rating);


            stars.forEach(function (item) {

                const rating =
                    Number(item.dataset.rating);


                if (rating <= selectedRating) {

                    item.classList.add("active");

                } else {

                    item.classList.remove("active");

                }

            });

        });

    });


    // ==========================================
    // SUBMIT REVIEW
    // ==========================================

    submitButton.addEventListener(
        "click",
        async function () {

            const name =
                nameInput.value.trim();

            const comment =
                commentInput.value.trim();


            // -------------------------------
            // VALIDATION
            // -------------------------------

            if (name === "") {

                alert("Please enter your name.");

                nameInput.focus();

                return;
            }


            if (selectedRating === 0) {

                alert("Please select a rating.");

                return;
            }


            if (comment === "") {

                alert("Please write a comment.");

                commentInput.focus();

                return;
            }


            // -------------------------------
            // BUTTON LOADING
            // -------------------------------

            submitButton.disabled = true;

            submitButton.innerHTML =
                "Sending...";


            // -------------------------------
            // STAR TEXT
            // -------------------------------

            const starsText =
                "★".repeat(selectedRating) +
                "☆".repeat(5 - selectedRating);


            // -------------------------------
            // EMAIL DATA
            // -------------------------------

            const templateParams = {

                customer_name: name,

                rating: selectedRating,

                stars: starsText,

                review: comment,

                submitted_at:
                    new Date().toLocaleString()

            };


            try {

                // ---------------------------
                // SEND EMAIL
                // ---------------------------

                const response =
                    await emailjs.send(
                        SERVICE_ID,
                        TEMPLATE_ID,
                        templateParams
                    );


                console.log(
                    "Email sent successfully:",
                    response
                );


                // ---------------------------
                // SAVE LOCALLY
                // ---------------------------

                saveReview(
                    name,
                    selectedRating,
                    comment
                );


                // ---------------------------
                // SUCCESS MESSAGE
                // ---------------------------

                alert(
                    "Thank you! Your review was submitted successfully."
                );


                // ---------------------------
                // RESET
                // ---------------------------

                nameInput.value = "";

                commentInput.value = "";

                selectedRating = 0;


                stars.forEach(function (star) {

                    star.classList.remove("active");

                });


                displayReviews();


            } catch (error) {

                console.error(
                    "EmailJS error:",
                    error
                );


                alert(
                    "Failed to send the review. Please try again."
                );


            } finally {

                submitButton.disabled = false;

                submitButton.innerHTML = `
                    Submit Review
                    <i class="fa-solid fa-arrow-right"></i>
                `;

            }

        }
    );


    // ==========================================
    // SAVE REVIEW
    // ==========================================

    function saveReview(
        name,
        rating,
        comment
    ) {

        const reviews =
            JSON.parse(
                localStorage.getItem(
                    "restaurantReviews"
                )
            ) || [];


        reviews.unshift({

            name: name,

            rating: rating,

            comment: comment,

            date:
                new Date().toLocaleDateString()

        });


        localStorage.setItem(
            "restaurantReviews",
            JSON.stringify(reviews)
        );

    }


    // ==========================================
    // DISPLAY REVIEWS
    // ==========================================

    function displayReviews() {

        if (!reviewsList) {
            return;
        }


        const reviews =
            JSON.parse(
                localStorage.getItem(
                    "restaurantReviews"
                )
            ) || [];


        reviewsList.innerHTML = "";


        reviews.forEach(function (review) {

            const reviewElement =
                document.createElement("div");


            reviewElement.className =
                "review";


            const starsHTML =
                "★".repeat(review.rating) +
                "☆".repeat(5 - review.rating);


            reviewElement.innerHTML = `

                <div class="review-name">
                    ${escapeHTML(review.name)}
                </div>

                <div class="review-stars">
                    ${starsHTML}
                </div>

                <div class="review-comment">
                    ${escapeHTML(review.comment)}
                </div>

            `;


            reviewsList.appendChild(
                reviewElement
            );

        });

    }


    // ==========================================
    // SECURITY
    // ==========================================

    function escapeHTML(text) {

        const element =
            document.createElement("div");

        element.textContent = text;

        return element.innerHTML;

    }


    // ==========================================
    // LOAD REVIEWS
    // ==========================================

    displayReviews();

});
