# Peripheral Vision Test / Trainer

[Click here to see the final product](https://gr-b.github.io/peripheral/peripheral-recognition/specification-extraction/alphabet-simplified-spec-v7-iteration-13.html)


Recommended settings: 
 - Letter size: 120
 - Exclusion radius: 150
 - "Make letters disappear after correct click": check


# Experiments using Claude to compile specifications into code (rather than generate code once and successively edit)

As a software engineer, I spend a lot of time staring at a fixed point in front of me, with my head angle fixed. I’ve heard that over time, this can cause a slow decline in peripheral vision. Rather than be a reasonable person and use any of the many perfectly good existing solutions for this, I decided to try my own hand at building one with Claude. So I typed out the following single prompt:

```jsx
Write a javascript canvas test of peripheral vision.

The peripheral vision test consists of a slowly moving (speed dependent on configured difficulty level (configuration in a modal before starting the game / test) red ball.
A black dot should be placed in the center of the canvas, such that the user can stare at the black dot while they attempt to attend to the red dot in their peripheral vision.
The user should place their head and eyes such that their field of vision ends at the edges of the screen.

The canvas should be the size of the whole browser window (visible room only). All measurements / constants should be relative to the visible width and height.

The user's goal is to, while keeping their eyes focused on the center black dot, keep their mouse positioned as close as they can to the red dot, while the red dot is moving.

The red dot should move smoothly in approximately a circle around the black dot (farther away depending on the difficulty -- the approximate radius from the red dot should be configurable with a slider in the configuration modal).
It should deviate from the circle by a random number up to a configurable amount (basically, it should wiggle around a lesser and larger radius at it moves in an rough circle).
It should randomly change clockwise / counter-clockwise direction after a random amount of time (and the minimum / maximum amount of random time should be configurable).

The score should be calculated via the euclidean distance from the mouse to the center of the red dot, with a reading taken every 100ms.
Draw a red line from the mouse to the center of the red dot, whose opacity is proportional to the distance (with opaque being very good score (low distance) and transparent being very bad (if the distance is more than half the width of the screen, then the line should be completely transparent)).

The duration of the exercise should be configurable in seconds.
During the exercise, show the number of seconds as it counts down.
The score should be finally tabulated as the average reading every 100ms over the entire exercise.
When the exercise is over, we should show the modal again, but this time, it should show the score.
```

To my surprise, this produced a self-contained HTML + javascript file, which worked without syntax or runtime errors (on the first try!). Try it out here — https://gr-b.github.io/peripheral/smooth-realtime-pursuits/peripheral-motion-test.html

![image.png](How%20to%20use%20Claude%20as%20a%20PRD%20compiler%2010c774a2c81380dba0b6fecce53d62e9/image.png)

It’s not actually a very good test of peripheral vision, but it is pretty much exactly what I specified it should be. The requirements are met! 

It seems that if you can precisely state your requirements ahead of time, and what you want is reasonable to be done in a single, self-contained HTML file of fewer than ~450 lines of code (Claude’s output limit), then Claude is a great place to start. 

I think most of my surprise comes from recently switching from using GPT 4 to Claude 3.5 Sonnet. The level of reliability with coding tasks is such an astonishing improvement from what I was used to with GPT.

# Experiment: Do we even need to write a PRD in the first place?

Curious, I decided to ask Claude merely to:

```jsx
Write a javascript canvas test of peripheral vision. It should be a self-contained HTML file.
```

It also ran with no runtime errors on the first try. Here is the result: https://gr-b.github.io/peripheral/smooth-realtime-pursuits/underspecified.html

It somewhat resembles the real peripheral vision test you would take at an optometrist’s office, using a very expensive machine. But, Claude didn’t tell me how it was supposed to work or how I was supposed to use it. And it doesn’t really work, even if you inspect it closely: you’re supposed to click the blue dots as they appear, but they appear and disappear almost instantly, and they are very small. In the expensive office machine, you don’t have to indicate where the dot appears, just that you have seen it or not. All around, this format is not really what I wanted. Instead, I didn’t really want a test of peripheral vision, what I actually wanted was a game that both aided in training your peripheral vision + hand eye coordination. I conclude from this that specification ability is a fundamental requirement to creating anything useful.

# This is an entirely new workflow

If my project is of medium size or complexity, I usually try to ask Claude to make whatever edit I am thinking of before resorting to doing things by hand. I paste the entire codebase (or the particular files relevant to the current change) in using https://github.com/gr-b/repogather (a small CLI tool I created for just this purpose). 

This workflow, in theory, aligns with the conventional way of working on a codebase: you have existing code, so you wouldn’t rewrite the entire thing every time you wish to make a small change. But if Claude works as a PRD compiler, then maybe this won’t be the ideal workflow in the future. 

Instead, we could merely make the change to the PRD, then use Claude to produce an entire new implementation. If that new implementation meets the new requirements, then we may have saved some expensive engineering time at the expense of a whole lot of LLM tokens.

With respect to the first iteration of the peripheral vision test above, I wanted some more features, so I added/edited this into the (informal) PRD:

```jsx

At the end of the game, it should draw a graph of the distance from the mouse to the target dot over the duration of the exercise (with the x axis being time into the exercise, and the Y axis being the distance).
The Y axis should be scaled so that the graph takes up 1 quarter of the area of the screen.

The line between the mouse and the red dot should be at full transparency if it was the full width of the screen away.

Persist the score to browser storage and then enable the user to view a graph of scores (y axis) over time (x axis, in historical attempt index)

Record the positions of the mouse and the target dot every 20ms. Also save this to localStorage (but only once -- at the same time that we persist the score at the end of the exercise). For each historical attempt, we want to enable the user to view a re-play of that specific attempt. In this re-play, we also need to still render the other things in the exercise, like the black dot at the center of the screen, the timer, and the variable transparency line between the mouse and the target dot. During re-plays, there should also be a <skip> button at the top right corner of the screen to enable us to go back.
```

Here is the result (again in a single attempt): https://gr-b.github.io/peripheral/smooth-realtime-pursuits/peripheral-motion-test-revision-2.html

Wow! I’m amazed that it wasn’t tripped up by the score + trajectory persistence + distance graph viewing. It also *almost* figured out the replay functionality. You can click to replay, but there is a bug where the program interprets replays as if they were real, and updates the score + trajectory + distance graph for the run (rather than replaying with no further side effects).

![image.png](How%20to%20use%20Claude%20as%20a%20PRD%20compiler%2010c774a2c81380dba0b6fecce53d62e9/image%201.png)

This is the result of me pressing “replay” twice: the trajectories are replayed, but re-recorded and appended to the history every time.

# What happens when we ask for something more complicated? Replay functionality

Something like the replay functionality is inherently more complicated to get right than anything in the first iteration. It requires thinking ahead to plan out what we are going to use to run the game, but also how those components might be re-used to accomplish the re-play functionality. 

I made a two attempts at updating the PRD, but restricted myself from performing this forethought / design / planning. None of these attempts panned out; Claude wasn’t able to produce a bug-free implementation in a single shot. I don’t claim that no such solution exists, but I suspect that this means that there is an unaccounted role here for technical design decisions. Did I just rediscover the TDD!?

Rather than do this myself, I asked Claude to design modular components that are more testable, maintainable, and re-usable. Here’s what it came up with:

```jsx
configManager.js: Configuration and configuration peristence
state.js: Manages the game state and its updates.
renderer.js: Handles all canvas-related operations.
gameEngine.js: Contains the main game logic and loop.
inputHandler.js: Handles input sources
historyManager.js: Handles saving and retrieving game history.
index.html: Main entry point
```

I then prompted Claude to carry out the implementation, giving me exact files that I could copy and paste. I reached the output limit, so I had to ask for a continuation, but after I produced and copied over the files, it again worked on the first try, but this time, the replay functionality worked like a charm!

Here is the final test: https://gr-b.github.io/peripheral/smooth-realtime-pursuits/smooth-pursuits-modularized/index.html

(note that if you completed any other tests, you’ll have to clear your local storage for this to work, as they are incompatible)

---

The above doesn’t really work too well as an actually peripheral vision test or training mechanism. Using a similar set of techniques, I created the following:

https://gr-b.github.io/peripheral/peripheral-recognition/specification-extraction/alphabet-simplified-spec-v7-iteration-13.html

(also need to clear your local storage)
