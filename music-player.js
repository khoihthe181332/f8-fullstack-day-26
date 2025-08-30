const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = {
    // Danh sách bài hát
    songs: [
        {
            id: 1,
            name: "Đôi Mươi",
            path: "./music/Đôi Mươi.mp3",
            img: "./img/doi-muoi.jpg",
            artist: "Hoàng Dũng",
        },
        {
            id: 2,
            name: "Giữ Anh Cho Ngày Hôm Qua",
            path: "./music/Giữ Anh Cho Ngày Hôm Qua.mp3",
            img: "./img/giu-anh-cho-ngay-hom-qua.jpg",
            artist: "Hoàng Dũng",
        },
        {
            id: 3,
            name: "Ngày Này Năm Ấy",
            path: "./music/Ngày Này Năm Ấy.mp3",
            img: "./img/ngay-nay-nam-ay.jpg",
            artist: "Việt Anh",
        },
        {
            id: 4,
            name: "Thói Quen (25 Mét Vuông)",
            path: "./music/Thói Quen (25 Mét Vuông).mp3",
            img: "./img/thoi-quen.jpg",
            artist: "Hoàng Dũng ft GDucky",
        },
        {
            id: 5,
            name: "Nàng Thơ",
            path: "./music/Nàng Thơ.mp3",
            img: "./img/nang-tho.jpg",
            artist: "Hoàng Dũng",
        },
        {
            id: 6,
            name: "đứa nào làm em buồn_",
            path: "./music/đứa nào làm em buồn_.mp3",
            img: "./img/dua-nao-lam-em-buon.jpg",
            artist: "Hoàng Dũng ft Phúc Du",
        },
        {
            id: 7,
            name: "Nửa Thập Kỷ (25 Mét Vuông)",
            path: "./music/Nửa Thập Kỷ (25 Mét Vuông).mp3",
            img: "./img/yen-concert.jpg",
            artist: "Hoàng Dũng",
        },
        {
            id: 8,
            name: "Tôi Muốn Làm Cái Cây",
            path: "./music/Tôi Muốn Làm Cái Cây.mp3",
            img: "./img/toi-muon-lam-cai-cay.jpg",
            artist: "Hoàng Dũng",
        },
        {
            id: 9,
            name: "Đoạn kết mới - Nàng Thơ (Live At Yên Concert)",
            path: "./music/Đoạn kết mới - Nàng Thơ (Live At Yên Concert).mp3",
            img: "./img/yen-concert.jpg",
            artist: "Hoàng Dũng",
        },
        {
            id: 10,
            name: "Còn Gì Đẹp Hơn (Mưa Đỏ Original Soundtrack)",
            path: "./music/Còn Gì Đẹp Hơn (Mưa Đỏ Original Soundtrack).mp3",
            img: "./img/con-gi-dep-hon.jpg",
            artist: "Nguyễn Hùng",
        },
    ],
    // Khởi tạo
    NEXT: 1,
    PREV: -1,
    currentIndex: 0,
    isSeeking: false, // Kiểm tra xem có đang tua k
    isLoop: localStorage.getItem("isLoop") === "true", // Kiểm tra xem có đang lặp bài k
    isShuffle: localStorage.getItem("isShuffle") === "true", // Kiểm tra xem có đang trộn bài k
    // Element
    trackBackground: $(".track-background"),
    songTitle: $(".song-title"),
    songArtist: $(".song-artist"),
    audio: $(".audio"),
    progress: $("#progress"),
    song: $(".song"),
    playList: $(".playlist"),
    // Button
    playToggleBtn: $(".btn-toggle-play"),
    nextBtn: $(".btn-next"),
    prevBtn: $(".btn-prev"),
    loopBtn: $(".btn-repeat"),
    downloadBtn: $(".btn-download"),
    shuffleBtn: $(".btn-random"),
    // Icon
    iconPlay: $(".icon-play"),
    getCurrentSong() {
        return this.songs[this.currentIndex];
    },
    loadCurrentSong() {
        const currentSong = this.getCurrentSong();
        this.songTitle.textContent = currentSong.name;
        this.songArtist.textContent = currentSong.artist;
        this.trackBackground.style.background = `url(${currentSong.img}) no-repeat center / contain`;
        this.audio.src = currentSong.path;
    },
    scrollPlayList() {
        const trackHeight = this.trackBackground.offsetHeight;

        document.addEventListener("scroll", () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newTrackHeight = trackHeight - scrollTop;

            this.trackBackground.style.height = newTrackHeight > 0 ? `${newTrackHeight}px` : "0";
            this.trackBackground.style.opacity = newTrackHeight / trackHeight;
            if (this.trackBackground.style.height === '0px') {
                this.trackBackground.style.marginTop = "unset";
            } else {
                this.trackBackground.style.marginTop = "20px";
            }
        });
    },
    scrollToActiveSong() {
        // const activeSong = $(".song.active");
        // activeSong.scrollIntoView({
        //     behavior: "smooth",
        //     block: "nearest",
        // });
    },
    swapSong(step) {
        this.currentIndex = (this.currentIndex + step + this.songs.length) % this.songs.length;
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
        this.audio.play();
    },
    handleSongChange() {
        this.nextBtn.addEventListener("click", () => {
            this.swapSong(this.NEXT);
        });

        this.prevBtn.addEventListener("click", () => {
            if (this.audio.currentTime < 2) {
                this.swapSong(this.PREV);
            } else {
                this.audio.currentTime = 0;
            }
        });
    },
    handleSongProgress() {
        const timeStart = document.querySelector(".time-start");
        const timeEnd = document.querySelector(".time-end");

        // Hàm định dạng thời gian từ giây sang mm:ss
        const formatTime = (seconds) => {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
            return `${min}:${sec}`;
        };

        this.audio.addEventListener("timeupdate", () => {
            const { duration, currentTime } = this.audio;
            if (!duration) return;
            const process = Math.round((currentTime / duration) * 100);
            this.progress.value = process;

            // Cập nhật hiển thị thời gian
            if (timeStart) {
                timeStart.textContent = formatTime(currentTime);
            }
            if (timeEnd) {
                timeEnd.textContent = formatTime(duration);
            }
        });

        this.progress.addEventListener("pointerdown", () => {
            this.isSeeking = true;
        });

        this.progress.addEventListener("pointerup", (e) => {
            this.isSeeking = false;
            const nextDuration = (e.target.value / 100) * this.audio.duration;
            this.audio.currentTime = nextDuration;
        });
    },
    handleSongLoop() {
        this.loopBtn.addEventListener("click", () => {
            this.isLoop = !this.isLoop;
            this.loopBtn.classList.toggle("active", this.isLoop);
            // lưu vào LocalStorage
            localStorage.setItem("isLoop", this.isLoop);
        });
    },
    handleShuffleSong() {
        this.shuffleBtn.addEventListener("click", () => {
            this.isShuffle = !this.isShuffle;
            this.shuffleBtn.classList.toggle("active", this.isShuffle);
            // lưu vào LocalStorage
            localStorage.setItem("isShuffle", this.isShuffle);
        });
    },
    handleChooseSong() {
        this.playList.addEventListener("click", (e) => {
            const optionBtn = e.target.closest(".option");
            const songNotActive = e.target.closest(".song:not(.active)");
            // Bắt sự kiện click nút option
            if (optionBtn) {
                e.stopPropagation();
                console.log("Option click");
                return;
            }

            // Bắt sự kiện song k có .active
            if (songNotActive) {
                this.currentIndex = Number(songNotActive.getAttribute("data-index"));
                this.loadCurrentSong();
                this.render();
                this.audio.play();
            };
        });
    },
    render() {
        const renderSong = this.songs.map((song, index) => {
            return `<div class="song ${this.currentIndex === index ? "active" : ""} " 
                        data-index="${index}">
                <div class="thumb"
                    style="background: url('${song.img}') center / cover;">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="artist">${song.artist}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div > `
        }).join("");
        this.playList.innerHTML = renderSong;
    },

    init() {
        this.loadCurrentSong(); // lấy bài hát đầu tiên
        this.scrollPlayList(); // Xử lý sự kiện scroll 

        // Xử lý sự kiện Play / Pause bài hát
        this.playToggleBtn.addEventListener("click", () => {
            if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.pause()
            }
        });

        this.audio.addEventListener("play", () => {
            this.iconPlay.classList.remove("fa-play");
            this.iconPlay.classList.add("fa-pause");
        });
        this.audio.addEventListener("pause", () => {
            this.iconPlay.classList.remove("fa-pause");
            this.iconPlay.classList.add("fa-play");
        });

        // Xử lý sự kiện Next / Prev bài hát
        this.handleSongChange();

        // Xử lý sự kiện Progress bài hát
        this.handleSongProgress();

        // Khi hết tự động next bài
        this.audio.addEventListener("ended", () => {
            if (this.isLoop) {
                this.audio.play();
            } else {
                this.swapSong(this.NEXT);
            }
        });

        // Xử lý sự kiện Loop bài hát
        this.handleSongLoop();

        // Xử lý sự kiện Shuffle bài hát
        this.handleShuffleSong();

        // Xử lý sự kiện Download bài hát
        this.downloadBtn.addEventListener("click", () => {
            const currentSong = this.getCurrentSong();
            this.downloadBtn.href = currentSong.path;
        });

        this.render();

        // Xử lý sự kiện Chọn bài hát
        this.handleChooseSong();

        // Cập nhật trạng thái nút loop, shuffle, ...
        this.loopBtn.classList.toggle("active", this.isLoop);
        this.shuffleBtn.classList.toggle("active", this.isShuffle);
    },
}

player.init();
