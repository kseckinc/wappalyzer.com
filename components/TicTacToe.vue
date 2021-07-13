<template>
  <div class="ttt-game">
    <div class="ttt-player">
      <svg
        class="ttt-player-icon ttt-player-icon-x ttt-player-icon--ahead"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19,10C19,11.38 16.88,12.5 15.5,12.5C14.12,12.5 12.75,11.38 12.75,10H11.25C11.25,11.38 9.88,12.5 8.5,12.5C7.12,12.5 5,11.38 5,10H4.25C4.09,10.64 4,11.31 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,11.31 19.91,10.64 19.75,10H19M12,4C9.04,4 6.45,5.61 5.07,8H18.93C17.55,5.61 14.96,4 12,4M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z"
        />
      </svg>

      <svg
        class="
          ttt-player-icon ttt-player-icon--behind
          ttt-player-icon ttt-player-icon--hidden
        "
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M20 12A8 8 0 1 0 12 20A8 8 0 0 0 20 12M22 12A10 10 0 1 1 12 2A10 10 0 0 1 22 12M15.5 8A1.5 1.5 0 1 1 14 9.5A1.54 1.54 0 0 1 15.5 8M10 9.5A1.5 1.5 0 1 1 8.5 8A1.54 1.54 0 0 1 10 9.5M17 15H13A4 4 0 0 0 9.53 17L7.8 16A6 6 0 0 1 13 13H17Z"
        />
      </svg>

      <div class="ttt-score ttt-score-x">0</div>
    </div>

    <div class="ttt-grid">
      <div class="ttt-row">
        <div class="ttt-cell" />
        <div class="ttt-cell" />
        <div class="ttt-cell" />
      </div>
      <div class="ttt-row">
        <div class="ttt-cell" />
        <div class="ttt-cell" />
        <div class="ttt-cell" />
      </div>
      <div class="ttt-row">
        <div class="ttt-cell" />
        <div class="ttt-cell" />
        <div class="ttt-cell" />
      </div>
    </div>

    <div class="ttt-player">
      <svg class="ttt-player-icon ttt-player-icon-o" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M9,11.75A1.25,1.25 0 0,0 7.75,13A1.25,1.25 0 0,0 9,14.25A1.25,1.25 0 0,0 10.25,13A1.25,1.25 0 0,0 9,11.75M15,11.75A1.25,1.25 0 0,0 13.75,13A1.25,1.25 0 0,0 15,14.25A1.25,1.25 0 0,0 16.25,13A1.25,1.25 0 0,0 15,11.75M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,11.71 4,11.42 4.05,11.14C6.41,10.09 8.28,8.16 9.26,5.77C11.07,8.33 14.05,10 17.42,10C18.2,10 18.95,9.91 19.67,9.74C19.88,10.45 20,11.21 20,12C20,16.41 16.41,20 12,20Z"
        />
      </svg>

      <div class="ttt-score ttt-score-o">0</div>
    </div>

    <svg class="ttt-icon ttt-icon-x" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      />
    </svg>

    <svg class="ttt-icon ttt-icon-o" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
    </svg>
  </div>
</template>

<script>
/* eslint-disable no-labels */

export default {
  mounted() {
    const game = document.body.querySelector('.ttt-game')

    const icons = {
      x: game.querySelector('.ttt-icon-x'),
      o: game.querySelector('.ttt-icon-o'),
    }

    const scores = {
      x: {
        el: game.querySelector('.ttt-score-x'),
        score: 0,
      },
      o: {
        el: game.querySelector('.ttt-score-o'),
        score: 0,
      },
    }

    const ahead = game.querySelector('.ttt-player-icon--ahead')
    const behind = game.querySelector('.ttt-player-icon--behind')

    let paused = true

    const cells = {}
    const axes = ['y', 'x']
    const players = ['x', 'o']

    function fill(cell, player) {
      cell.value = player

      cell.el.firstChild && cell.el.removeChild(cell.el.firstChild)

      cell.el.appendChild(icons[player].cloneNode(true))
    }

    function reset() {
      scores.x.el.textContent = scores.x.score.toLocaleString()
      scores.o.el.textContent = scores.o.score.toLocaleString()

      ahead.classList[scores.x.score < scores.o.score ? 'add' : 'remove'](
        'ttt-player-icon--hidden'
      )
      behind.classList[scores.x.score < scores.o.score ? 'remove' : 'add'](
        'ttt-player-icon--hidden'
      )

      for (let y = 1; y <= 3; y++) {
        for (let x = 1; x <= 3; x++) {
          const cell = cells[y][x]

          cell.el.classList.remove('ttt-blink')

          cell.el.firstChild && cell.el.removeChild(cell.el.firstChild)

          cell.value = ''
        }
      }

      const { empty } = check()

      play(empty)
    }

    function checkLine(line, complete) {
      for (const player of players) {
        if (line[player].length === 3) {
          complete.player = player

          complete.cells.push(...line[player])
        }
      }
    }

    function check(dryrun) {
      const empty = []
      const complete = {
        player: null,
        cells: [],
      }

      for (const axis of axes) {
        const diagonal = { o: [], x: [] }

        for (let a = 1; a <= 3; a++) {
          const y = a
          const x = axis === 'y' ? y : 4 - y

          const cell = cells[y][x]

          cell.value && diagonal[cell.value].push(cell)

          const straight = { o: [], x: [] }

          for (let b = 1; b <= 3; b++) {
            const y = axis === 'y' ? a : b
            const x = axis === 'y' ? b : a

            const cell = cells[y][x]

            cell.value ? straight[cell.value].push(cell) : empty.push(cell)
          }

          checkLine(straight, complete)
        }

        checkLine(diagonal, complete)
      }

      if (!dryrun) {
        paused = true

        if (complete.player) {
          scores[complete.player].score++

          complete.cells.forEach(({ el }) => el.classList.add('ttt-blink'))

          if (complete.player === 'o') {
            ahead.classList.add('ttt-player-icon--hidden')
            behind.classList.remove('ttt-player-icon--hidden')
          }

          setTimeout(() => {
            reset()
          }, 1200)
        } else if (!empty.length) {
          setTimeout(() => {
            reset()
          }, 1200)
        }
      }

      return { winner: complete.player, empty: [...new Set(empty)] }
    }

    function play(cells) {
      setTimeout(() => {
        let found = false

        search: for (const player of players) {
          for (const cell of cells) {
            cell.value = player

            const { winner, empty } = check(true)

            if (winner || !empty) {
              found = true

              fill(cell, 'x')

              break search
            } else {
              cell.value = ''
            }
          }
        }

        if (!found) {
          const cell = cells[Math.round(Math.random() * (cells.length - 1))]

          fill(cell, 'x')
        }

        const { winner, empty } = check()

        if (!winner && empty) {
          paused = false
        }
      }, 400)
    }

    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        const el = game.querySelector(
          `.ttt-row:nth-child(${y}) .ttt-cell:nth-child(${x})`
        )

        el.addEventListener('click', () => {
          if (paused) {
            return
          }

          const cell = cells[y][x]

          if (!cell.value) {
            paused = true

            fill(cell, 'o')

            const { winner, empty } = check()

            !winner && play(empty)
          }
        })

        cells[y] = cells[y] || {}

        cells[y][x] = {
          x,
          y,
          el,
          value: '',
        }
      }
    }

    reset()
  },
}
</script>

<style>
.ttt-game {
  display: flex;
  align-items: center;
  margin: auto;
  width: 13rem;
}

.ttt-player {
  text-align: center;
}

.ttt-player-icon {
  color: #4608ad;
  width: 1.2rem;
  height: 1.2rem;
}

.ttt-player-icon--hidden {
  display: none;
}

.ttt-score {
}

.ttt-grid {
  background: #f0ebf9;
  border-radius: 4px;
  font-size: 0;
  line-height: 0;
  margin: auto;
  width: 6rem;
}

.ttt-cell {
  border: 1px solid #4608ad;
  border-width: 1px 0 0 1px;
  display: inline-block;
  font-size: 1em;
  padding: 0.2rem;
  width: 2rem;
  height: 2rem;
}

.ttt-row:first-child .ttt-cell {
  border-top: none;
}

.ttt-cell:first-child {
  border-left: none;
}

.ttt-icon {
  display: none;
  height: 100%;
  width: 100%;
}

.ttt-cell .ttt-icon {
  color: #4608ad;
  display: block;
}

.ttt-blink .ttt-icon {
  animation: blink 250ms step-end 0s 3;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
