/**
 * script.js
 * Skrip JavaScript Terpadu untuk Website Profil Mahasiswa UKRI.
 * Menggabungkan interaktivitas preview kartu proyek dan validasi form kontak.
 */

document.addEventListener('DOMContentLoaded', function () {
    /* ==========================================================================
       1. INTERAKSI PREVIEW KARTU PROYEK (Beranda / index.html)
       ========================================================================== */
    const projectCards = document.querySelectorAll('.project-card');

    if (projectCards.length > 0) {
        // Fungsi untuk menutup semua overlay preview aktif
        function closeAllPreviews() {
            projectCards.forEach(function (card) {
                card.classList.remove('is-active');
                const overlay = card.querySelector('.card-preview-overlay');
                if (overlay) {
                    overlay.setAttribute('aria-hidden', 'true');
                }
            });
        }

        projectCards.forEach(function (card) {
            const overlay = card.querySelector('.card-preview-overlay');
            const detailLink = card.querySelector('.preview-btn');

            // Klik atau tap pada kartu (touchscreen)
            card.addEventListener('click', function (event) {
                // Jika yang diklik adalah tombol detail link, biarkan navigasi browser berjalan
                if (detailLink && (event.target === detailLink || detailLink.contains(event.target))) {
                    return;
                }

                const isActive = card.classList.contains('is-active');
                if (!isActive) {
                    closeAllPreviews();
                    card.classList.add('is-active');
                    if (overlay) overlay.setAttribute('aria-hidden', 'false');
                } else {
                    card.classList.remove('is-active');
                    if (overlay) overlay.setAttribute('aria-hidden', 'true');
                }
            });
        });

        // Menutup preview ketika pengguna mengetuk/mengklik di luar kartu proyek
        document.addEventListener('click', function (event) {
            let isInsideAnyCard = false;
            projectCards.forEach(function (card) {
                if (card.contains(event.target)) {
                    isInsideAnyCard = true;
                }
            });

            if (!isInsideAnyCard) {
                closeAllPreviews();
            }
        });

        // Aksesibilitas keyboard (ESC untuk menutup preview)
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' || event.key === 'Esc') {
                closeAllPreviews();
            }
        });
    }

    /* ==========================================================================
       2. VALIDASI FORMULIR KONTAK (kontak.html)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const statusContainer = document.getElementById('form-status');

    if (contactForm) {
        const nameInput = document.getElementById('nama');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subjek');
        const messageInput = document.getElementById('pesan');

        // Pola regex validasi format email dasar
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Menghapus tanda error saat pengguna mulai mengetik kembali
        [nameInput, emailInput, subjectInput, messageInput].forEach(function (input) {
            if (!input) return;
            input.addEventListener('input', function () {
                if (input.classList.contains('is-invalid')) {
                    input.classList.remove('is-invalid');
                }
            });
        });

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let isValid = true;
            let firstInvalidField = null;

            // Validasi Nama Lengkap
            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                nameInput.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = nameInput;
            } else {
                nameInput.classList.remove('is-invalid');
            }

            // Validasi Email
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = emailInput;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            // Validasi Subjek
            if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
                subjectInput.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = subjectInput;
            } else {
                subjectInput.classList.remove('is-invalid');
            }

            // Validasi Pesan
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                messageInput.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidField) firstInvalidField = messageInput;
            } else {
                messageInput.classList.remove('is-invalid');
            }

            if (!isValid) {
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                return;
            }

            // Bila semua data valid di sisi client
            if (statusContainer) {
                statusContainer.className = 'form-status show status-info';
                statusContainer.innerHTML = `
                    <div class="status-info-header">
                        <span>&#9432;</span> Validasi Klien Berhasil
                    </div>
                    <p>
                        Data formulir Anda valid secara sintaksis di browser. Namun, ini adalah <strong>proyek front-end statis Modul 4</strong> tanpa server backend aktif, sehingga pesan <em>belum benar-benar terkirim ke email pemilik situs</em>.
                    </p>
                    <div class="status-summary">
                        <strong>Pratinjau Data yang Siap Dikirim:</strong><br>
                        Pengirim: ${escapeHtml(nameInput.value.trim())} &lt;${escapeHtml(emailInput.value.trim())}&gt;<br>
                        Subjek: ${escapeHtml(subjectInput.value.trim())}<br>
                        Pesan: "${escapeHtml(messageInput.value.trim())}"
                    </div>
                `;

                statusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        // Helper sanitasi tampilan
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }
});
