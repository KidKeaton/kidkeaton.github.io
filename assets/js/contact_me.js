(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function showAlert(container, type, message) {
        if (!container) {
            return;
        }
        var alert = document.createElement("div");
        alert.className = "alert alert-" + type;
        alert.textContent = message;
        container.innerHTML = "";
        container.appendChild(alert);
    }

    ready(function () {
        var form = document.getElementById("contactForm");
        if (!form) {
            return;
        }

        var successContainer = document.getElementById("success");
        var submitButton = document.getElementById("sendMessageButton");

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (successContainer) {
                successContainer.innerHTML = "";
            }

            var name = (form.querySelector("#name") || {}).value || "";
            var email = (form.querySelector("#email") || {}).value || "";
            var phone = (form.querySelector("#phone") || {}).value || "";
            var message = (form.querySelector("#message") || {}).value || "";
            var subjectField = form.querySelector("#email-subject");
            var subject = subjectField ? subjectField.value : "Inquiry";
            var target = (form.getAttribute("data-contact-email") || "").trim();

            var errors = [];
            if (!name.trim()) {
                errors.push("Please share your name.");
            }
            if (!email.trim()) {
                errors.push("We will need an email address to follow up.");
            }
            if (!message.trim()) {
                errors.push("Tell us a little about the workflow or project.");
            }
            if (!target) {
                errors.push("Contact email is not configured.");
            }

            if (errors.length > 0) {
                showAlert(successContainer, "danger", errors.join(" "));
                return;
            }

            var lines = [
                "Name: " + name.trim(),
                "Email: " + email.trim()
            ];
            if (phone.trim()) {
                lines.push("Phone: " + phone.trim());
            }
            lines.push("");
            lines.push(message.trim());

            var mailtoUrl = "mailto:" + encodeURIComponent(target) +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(lines.join("\n"));

            if (submitButton) {
                submitButton.disabled = true;
            }

            window.location.href = mailtoUrl;

            if (successContainer) {
                showAlert(successContainer, "success", "Thanks! Your email client will open so you can send the inquiry.");
            }

            form.reset();

            if (submitButton) {
                setTimeout(function () {
                    submitButton.disabled = false;
                }, 1200);
            }
        });
    });
}());
