(Transcribed by TurboScribe. Go Unlimited to remove this message.)

My query pattern, all right, the query pattern is for acquisition. Okay, proceed how you proceed. Stay on slash, but that's your start page. 

You can't do that. You can't have a component. But today it is like this. 

Yeah, that's why, that's why this change is necessary. Right. Not. 

Okay, then you do this, like where to run. Right. If the decision is to stay on start page, keep it at slash because it's not impacting, right? This change, it's not impacting us. 

Either we're going to go stay here on the start, or we go to this, or we stay here, or we go to save. Think about what I just said, right? The whole point of the component layer is to determine display. If you don't separate slash and start page, you mix the two up.

Right. And I don't want that. This should be routing. 

This should only be routing. This should contain display. Right now, slash contains the start page.

If you don't change that, then you will have your routing logic and your display logic in the same slash, which renders the start page JSX file. No, but today also it is there, right? So, today, start equals, slash equals start page JSX. Plus routing.

You decide like whether I'm going to go to trap, or I'm going to go to m1v2 or m1v1. But that happens before you even mount the application. The concept of like what page am I in doesn't exist because there is no application mount.

All of that code that we're talking about runs in main. Right? so, when you're in main, the notion of pages doesn't exist. You're not in start page. 

You're not anywhere. You are in the void before the application gets put on display. And that is one of the problems I'm trying to address.

Because I need to run hooks and stuff. So, if I do it in this, then it loses the purpose of the start page, right? Right. Exactly.

You need a component to say, hey, when are you starting your policy? And you need a separate component to say, hey, you're resuming your policy? Where should you go? Those are separate things. And if you keep them together, you couple them, and you make a really simple, easy-to-understand component. The start page, and hopefully your decision logic, you make those two simple-to-understand components.

I'm afraid I'm touching this existing address of this route. It should not break in a bunch of things. That's why you're doing the switch.

When you do the switch, everything should work. Because when you do the switch, like when you switch start date into slash start date, Then, obviously, whoever navigates to start date is going to land on start date. But whoever lands on slash is going to go through this decision and immediately get to start date.

Everyone is navigating to slash, because start date right now doesn't exist. Got it. Okay.

So, to start with, Nihan, for your understanding, let's say we have a release branch. We create a branch from the release branch. Today, whatever it says, I'm going to stay on the triage page, which is the slash for me today.

And it shows location and the start date. Just change that slash to start date. In the app also, the pages.startDate should have address of slash startDate.

That's like part one of the change, very simple first change. Have that done in your branch. Okay, so when you test your branch, whenever you land on this, it should redirect you to this, the current acquisition.

Okay. This is done. Let's move on.

And that's it. Once you have that structure, everything flows as it should. Because you're going to have... This dude's got four erasers.

He's not going to miss a tile. Okay. So, yeah.

If we put some file names in here, it might make things clearer. Right? So, you're going to have right now... Right now, you have pages.startDate. And, like, cam location is going to be all sorts of fuck. I don't write with my hands often.

Sorry about that. Right? So, pages.startDate right now is slash. Right? And then we don't have any other.

Right? So, what I want you to do is I want you to change pages.startDate to startDate. Then I want you to introduce pages.landing. And that's your new slash. Right? Then you're going to mount that in JSX and all of that.

But your slash routes slash landing. All this thing is going to do in the first store you deliver... Redirect to pages.startDate. Right? That's it. That's all you should do.

This is your established structure. This is the playground. This is where you're going to be able to add your additional appendices.

This keeps the whole startDate page intact. The only thing is it changes URL binding. Now, if anyone, no one will, but in the rare case that anyone touches the start page who isn't you, you're not going to have merge conflicts.

Your conflicts are in app JSX where you change the bindings. And that merge conflict is super easy to resolve. The merge conflicts is not that big a deal.

But those are the tools that you use, the reasons why you say I need a topic branch that isn't a protected branch. Right? So that's why I'm saying... But anyway, this is your first route. Right? Eventually after you merge, you're going to need another piece.

Right? You're going to need to redirect based on the same quote. Okay. So then you're going to have to introduce a hook because redirection logic is not display logic.

So this guy will then call useResumeQuote. Right? I would like you to put an enable parameter on this. But then we are... We don't... What was that? InitiateURL something was there.

That happens in main. That happens in main. So we're not going to touch that.

That's like even before. Right? So we're going to come here to see where we're going to land. Because I've stopped speaking to the results already.

So your getInitialURL is necessary. GetInitialURL should go away. Go away, right? Go away.

No, but what if... You should always mount to landing. But what about the logic in there already? That logic needs to come to landing. Of course.

Right? Because think... I know it sounds complex. But think about what the app is doing. No, no.

How many places... This is cleaner. What? This is cleaner. Exactly.

How many places should your app have to make decision points of what page should I render? Exactly one. Right? If you don't remove that getInitialURL, you'll have exactly two. One in main and one in landing.

And there's a possibility that one of them goes out of sync with the other and then you have a redirection. Right? So you have to put all of that to the same place. So always land on landing.

The landing is going to say, hey, redirect pages on start date. Redirect based on resume quote. This is your new functionality.

But there's also an old piece of functionality you're going to refactor in, which is your getInitialURL. And now this is going to be as redirect. Right? This is not getInitial.

This is getRedirect. Because you're going to go from landing to whatever. You're not just going to load the page there.

Is that kind of making sense? What you're going to end with is a landing page that is super long in terms of logic. And you're going to say, this sucks. I need to pull it to a hook.

And that's when this guy sucks. Okay? Now useResumeQuote is something that depending on how we structure it, useResumeQuote might be able to live in common. And this guy is what we would reuse in servicing.

Servicing would have to write its own landing page that handles its own concerns. However, it handles its own concerns. But the appendages to resume the quote, fetch a quote, what status is it in, what particulars are there on this quote, this should be shareable.

Right? I don't mind if you introduce all of this in acquisition. And then once you get the servicing requirements, you say, okay, now this guy goes to servicing. Or you say, hey, these are just different enough that I can't.

I can't. I need to write one for acquisition and rewrite the hook for servicing. We'll make that decision when we get there.

But my biggest concern is that the routes are clean and that the redirection route does the one thing it's supposed to do, redirection. And by that, nowhere else in the app should we be redirecting. Does this make sense? So you got it right.

So whatever MR you have, let's do some refactoring based on this. And then is it okay if we send it to you? Yeah, yeah, that's fine. I should be your reviewer for all of this.

So your first story is 90 pages. Story? I already have my story. I just need to do it incrementally.

Right. Your first deliverable. I will never police your Jira tickets unless they're so wrong that it gives me a heart attack.

So I don't care how many merge requests you take to do this, how many Jira tickets you take to do this. The division of work that will let you merge the fastest is as follows. So the first one is landing page.

How was this? Got it? Got it. Got it. So landing page, intro, and the switch.

This is the most important merge request, and you can do this today without doing anything about the redirection, anything about any of this. Right. Then the second one is this guy.

The get initial URL switch. Now your landing route does the new thing and the old thing, and then you come in and code your landing page. Even if you don't do this right away, it's still going to work because basically we have two routing.

It's going to send me to slash, and I land it here, and then I do redirect to stop page. If it doesn't land on the slash, if it takes me to a code result, then I go to code results, right? And that's fine. The reason why I have you do it this way is because I want you to make sure that the functionality gets integrated.

It has to be in one single place? Yeah. Today is what? This is 1.4, 1.5, right? We are closing next week, right? I was more concerned about the stories and the work we have, right? So even if I don't move this, I want the redirection and then the zoom hook in place so that you can review the hook and everything. And then eventually we'll move this as well because this is a complete solution, right? It's not only for a zoom code, it's for acquisition as well, like the normal flow as well, right? So let's say this.

This is contingent on you getting it working without it. So in other words, merge one. Merge request one is there.

Once you merge request one, start doing your routing decision changes. If you can get there, if you can refresh pages in the flow and all of that without implementing your get initial URL functionality, then go ahead and start doing your piece. If you can't for whatever reason, then come back and do this first.

The reason why I'm asking you to do this first, I know it's not new functionality, I know it's the refactor, but it's because this makes your playground clean, right? This one says, here's my playground. This one says, oh, my old toys can play with my new toys. And then you introduce your new toys.

Because if not, if there's problems, you're going to be like, what broke? My old toys, my new toys, or my playground altogether, right? So that's my preference, but I will review the MRs in any order you submit them with the caveat that this is the most important one. So today in your, did you introduce a resume code route already? Yes. Okay.

So whatever you've written in the resume code can go to that landing page. Yep, should be fairly simple. Plus this, which we don't have today.

Okay. So that is a resume slash code dot GSX today, and then in the pages dot that, you have resume code resume code. Instead of that, resume code goes to slash, call it landing, call it landing.

Start date becomes slash start date. And then this, if you don't find your parameter, just simply navigate to start date. No, not even if you don't, don't look for parameters.

The only thing it should do is navigate to start date. Then the next story is, if you pass the parameter, that's when we look for it. I mean, he's like a step above.

Oh, okay. But do we need to touch navigation for it? No, no. All navigation is going to be a transient navigation.

You don't need to call log page start and log page complete. Right? So the code for the landing JSX is going to be a hook call, right? Like a custom hook call. It's probably going to take some callbacks of saying, where do I navigate on A? Where do I navigate on B? And so on.

And then return null. The hooks layer, use recent quote, it might take, like, draft. And it accepts a function, and it'll run it with its own draft.

Or whatever, right? This is the, like, mapping that we talked about that says this status means this pitch. That would go into here. That's an argument to use recently.

But if we change this, I'm thinking, like, we have that back model. So are we, like, going, jumping to the triage page? No. The navigation needs to be transient.

There's a key in the nav hook when you call navigate, where you pass it to. You also can pass it transient, and then it doesn't include it. So when you browse it back, none of that stuff is there.

Oh, even if, like, we are navigating back to the triage page, we would be doing, like, this. Pages.start. And it's going to read. Yes.

That's the whole reason why I use constants. Is that, yeah. But, yeah, that should be that means that you're going to have four merge requests.

I anticipate four. One, this one. Two, whichever one of these you decide to run into first.

Three, whichever one of these you decide to run into second. And four, the inevitable cleanup that you're going to have to do in columns. I would suggest, like I said, you guys don't have the servicing requirements yet.

Don't make your life hard. Don't touch common components. Once you're fully implemented, you're like, here you go.

This should work. Then start thinking, what are the servicing requirements? Are they different enough that this guy needs a hook, like a copy-paste hook in servicing? Or can't we take this to columns? Once you have those requirements, come to me and let's talk about it. Because right now, for acquisition, it's a straight down.

This status, this page. But in servicing, it might not be that. So let's structure this second argument that handles the decision in a way that both acquisition and servicing can handle it.

But for that, we need to know those requirements. Okay. You may not see that maybe you're not to take.

Yeah. But we got what you're saying about it. And then the MRs may not be in the order like you suggested because we have some of the work done.

That's fine. But whatever we have, we're going to send it over. The very first merge request needs to contain this.

I don't care if the very first merge request contains this. As long as this guy's in it. Okay.

Right? It can be a super setup. So now we are planning to have a feature branch? No feature branch. This enables you to not have a feature branch.

The reason why we were having a feature branch so that we can jump into the review early, like while you're reviewing, they are testing. We don't want to break that. You're not going to.

Now we're structured in a way that we're not going to regardless of how we do it. Right. And so what you can do is let me be the delegate approver.

And that will make your life a lot easier because I'll give you delegate approval. I'll put you in the queue. You're going to get a million comments the first review I make.

And then you're going to get your delegate approval. And then when you get to your next level approval, since I'm your delegate, the other users are going to understand. This happens all the time when I'm delegate.

Right? So that will make your life easier. Okay. We've said a lot of words for very little concepts.

Questions? Concerns? We good? Yeah, we're good. So we have Friday Monday Tuesday. Let's see what we can deliver today.

We will be needing some of your capacity and time for the review, right? Yeah, for sure. That's fine. I'll prioritize your MRs for this.

There's this one and some other thing I need to prioritize. Okay. So that will be fine.

It sounds like you guys are time constrained. Is that the case? I can do this first MR in like 20 minutes. Would you like me to do this? Or is it easier for you to extract what you have into it? We'll do it.

Okay. Don't suffer. Like I said, I can do steps two and three for you.

I cannot help you, but one I can. So if you find yourself like, hey, there is a risk of carryover because I get it that this is easy, but this is the only piece I can help you with besides the time. So if I do this for you, will that lower your risk of carryover? If so, then let me do this.

I can have this done before lunch is over. But that's you proposing, I'm not asking. I mean, I'm offering because you guys need my help, right? Sure.

This would set the platform, actually. Right. Exactly.

You're building a platform for us. Right. And that's what, you know, let's build a platform.

Crazy, huh? Doing my job, doing my job, right? But, yeah. So, yeah, let's do that. Then I'll send you.

So now it's going to be a little different. So you are going to be my delegate. Okay.

Okay? I'll send you this MR as soon as I finish and I'm just going to go grab some sushi and cook while I eat. And then you'll approve me. You'll take my code and then we'll go back to I'm your delegate for your extra additions.

Fair? Okay. Cool. Let me grab some sushi and I'll get started.

Thank you so much. Great discussion. Yep.

Yep, yep.

(Transcribed by TurboScribe. Go Unlimited to remove this message.)
