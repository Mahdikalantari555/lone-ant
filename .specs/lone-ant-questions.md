# Open questions

**Project:** lone-ant

Things we still don't know or aren't sure about. Write them as plain questions.

- What exactly does "play and live as an ant" feel like moment to moment?
  (walking? carrying? choosing?) We know the feeling we want, but not the
  daily loop that delivers it.
- What makes a player come back tomorrow? What is the reason to reopen the app
  once the first novelty wears off?
- How does the colony "grow over time" in a way that feels rewarding and not
  just like a bigger number?
- What is the threat that matters most — spiders, starvation, the dark, or
  something else — and how often should it show up?
- Is carrying food home enough of a reason to move, or do we need other jobs
  for the player ant to do?

## Doubts

The biggest risk is not the coding — current AI agents can build the moving
parts (movement, food, worker ants, pheromones, a small nest, spiders, save
and load, an Android app). The real doubt is whether a fun, coherent loop
emerges from those parts, and whether long-term progression stays interesting
instead of flattening out. Balancing the simulation and designing a game worth
finishing is the hard part, and that is the human's job, not the agent's.

There is also an open tooling question worth flagging (technical, for later):
build it as a browser game first with Phaser + TypeScript and put it on the
web (sharable link, instant testing from a phone, no app store), then wrap the
same game as an installable Android app (APK) with Capacitor when we want it
on a home screen. This "web first, phone later" path looks like the faster way
to actually finish from a phone. The main thing to confirm: does the colony
still save and persist offline when played as a plain web page (it should,
using storage on the device), or does that need the app wrapper?

- Should the web version be the primary way people play, with the APK as a nice
  extra — or is the phone app the real goal and the web just a dev convenience?
