

    window.addEventListener('DOMContentLoaded', (event) => {

    let cards = Array.from(document.querySelectorAll('.card'))
    let containers = Array.from(document.querySelectorAll('.container'))
    let winnerDisplay = document.querySelector('.winner')
    let clickDisplay = document.querySelector('#click')
    let timer = document.querySelector('#timer')
    let sound = document.querySelector('#sound')
    
    let layers = document.querySelectorAll('.winner-container, .loser-container')
    
    class AudioController {
        constructor() {
            this.backgroundMusic = new Audio('./assets/audio/we-are.mp3')
            this.flipCard = new Audio('./assets/audio/Card-flip-sound-effect.mp3')
            this.match = new Audio('./assets/audio/matched.mp3')
            this.notMatched = new Audio('./assets/audio/unmatch.mp3')
            this.winner = new Audio('./assets/audio/win.mp3')
            this.loser = new Audio('./assets/audio/loser.mp3')
        }
    
        playBackgroundMusic() {
            this.backgroundMusic.volume = 0.4
            this.backgroundMusic.play()
        }
    
        stopBackgroundMusic() {
            this.backgroundMusic.pause()
        }
    
        playFlipCard() {
            this.currentTime = 0
            this.flipCard.play()
        }
    
        playMatchedCards() {
            this.match.play()
        }
    
        playNotMatch() {
            this.notMatched.play()
        }
    
        playWinner() {
            this.stopBackgroundMusic()
            this.winner.play()
        }
    
        stopPlayingWinner() {
            this.winner.pause()
            this.winner.currentTime = 0
        }
    
        stopPlayingLoser() {
            this.loser.pause()
            this.loser.currentTime = 0
        }
    
        playLoser() {
            this.stopBackgroundMusic()
            this.loser.play()
        }
    
    }
    
    
    class Game {
        constructor(totalTime, containers, cards) {
            this.cards = cards
            this.containers = containers
            this.audio = new AudioController()
            this.totalTime = totalTime
            this.remainingTime = totalTime
            this.selectedCards = []
        }
    
        start() {
            this.audio.stopPlayingWinner()
            this.audio.stopPlayingLoser()
            this.audio.playBackgroundMusic()
            this.shuffleCards()
            this.remainingTime = this.totalTime
            this.cptClick = 0
    
            timer.innerText = this.remainingTime
            clickDisplay.innerText = this.cptClick
    
        }
    
        resetCard() {
            cards.forEach(function (card) {
                card.classList.remove('active')
                card.style.display = 'block'
            })
            this.selectedCards = []
        }
    
        shuffleCards() {
            let cardElements = this.containers
            shuffle(cardElements)
            containers.forEach(function (card) {
                card.style.order = cardElements.indexOf(card)
            })
        }
    
        flipCard(card) {
            card.classList.add('active')
        }
    
        pushCard(card) {
            if (!this.selectedCards.includes(card)) {
                this.audio.playFlipCard()
                this.selectedCards.push(card)
                clickDisplay.innerText = ++this.cptClick
            }
        }
    
        matchedCards() {
            if (this.selectedCards.length == 2) {
                let classCardOne = this.selectedCards[0].lastElementChild.classList.value
                let classCardTwo = this.selectedCards[1].lastElementChild.classList.value
    
                if (classCardOne === classCardTwo) {
                    this.audio.playMatchedCards()
                    this.selectedCards.forEach(function (card) {
                        setTimeout(function () {
                            card.style.display = 'none'
                            card.parentElement.style.cursor = 'default'
                        }, 1000)
                    })
                    this.selectedCards = []
                } else {
                    this.audio.playNotMatch()
                    this.selectedCards.forEach(function (card) {
                        setTimeout(function () {
                            card.classList.remove('active')
                        }, 1000)
                    })
                    this.selectedCards = []
                }
            }
    
        }
    
        winner() {
            let activatedCards = document.querySelectorAll('.card.active')
    
            if (activatedCards.length === cards.length) {
                let winAudio = this.audio
                setTimeout(function () {
                    winAudio.playWinner()
                    winnerDisplay.classList.add('active')
                    document.body.style.overflow = 'hidden'
                    document.querySelector('#winner-click').classList.add('active')
                    document.querySelector('#winner-click').innerText += " " + mixOrMatch.cptClick
                    document.querySelector('#winner-timer').innerText += " " + (mixOrMatch.totalTime - mixOrMatch.remainingTime)
                }, 1000)
            }
        }
    
        loser() {
            if (this.remainingTime == 0) {
                if (!document.querySelector('.winner').classList.contains('active')) {
                    if (!document.querySelector('.loser').classList.contains('active')) {
                        document.querySelector('.loser').classList.add('active')
                        mixOrMatch.audio.playLoser()
                    }
                }
            }
        }
    
    }
    
    
    let mixOrMatch = new Game(100, containers, cards)
    mixOrMatch.start()
    
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            mixOrMatch.flipCard(card)
            mixOrMatch.pushCard(card)
            mixOrMatch.matchedCards()
            mixOrMatch.winner()
        })
    })
    
    layers.forEach(function (layer) {
        layer.addEventListener('click', function () {
            mixOrMatch.resetCard()
            layer.firstElementChild.classList.remove('active')
            mixOrMatch.start()
        })
    })
    
    sound.addEventListener('click', function () {
        sound.classList.toggle('red')
        if (sound.classList.value === 'red') {
            mixOrMatch.audio.stopBackgroundMusic()
        } else {
            mixOrMatch.audio.playBackgroundMusic()
        }
    })
    
    let idInterval = setInterval(() => {
        if (document.querySelector('#winner-click').classList.value !== 'active' || document.querySelector('.loser').classList.value !== 'active') {
            mixOrMatch.remainingTime--
            timer.innerText = mixOrMatch.remainingTime
    
            mixOrMatch.loser()
        }
    }, 1000);
    
    
    
    /* Helpers */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    function shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    })