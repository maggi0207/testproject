(Transcribed by TurboScribe. Go Unlimited to remove this message.)

Yep, yeah, that exists. That in M1 Acquisition V2. Andy wrote that. 

I've been playing with that right now. Right, that's the one that's in the reroute service. Yep, acquisitions have a reroute service and that calls on common code. 

But yeah, I know what you're talking about. You don't have to show me. Right, so here we are routing, right? We're staying in M1 V2.

Right, so just before this, after this, I mean before this, like if I see my parameter, I route them to let's say slash resume code. And that resume code is in route. Let's say I create a new folder and then I call it resume code.

And when I go to that, I run some, you know, interstitial in the user side and then run the hook. And then that hook actually calls my service and client. Okay, and then based on the data, I again do some processing here and then navigation, like navigation.

That's how I navigate to wherever I want to navigate them to. But this particular route does not have any need because it's not going to have any component of its own. It just, you know, routes.

Right, but just because it doesn't have, it does have a component of its own, right? You doing this logic can happen at the page level, right? Like if you really, really think about it, a component is just a hook that returns JSX instead of an object. Right, like if you really, really think about it. Components can call effects, hooks can call effects, right? And so when you say like, hey, we have just a file that returns null and calls a bunch of effects, that's a hook.

And that's fine. You can attempt rendering a hook as if they were components. You should think of them interchangeably, right? Obviously a hook doesn't put anything on the screen, but the life cycle that a component has is the same life cycle that a hook has.

So I don't really have an issue with this approach. What I will say is I have three questions, and this is regardless of which approach you take. This is what I thought you were going to get me about.

The standard approach is what you're describing, right? Like as of the application architecture that we've established, what you're describing is how it should happen. But then, yeah, my questions are, one, okay, you have a routing decision, right? Like the commented out code that I saw whoever was presenting a couple minutes ago, they showed a function that said like if the quote is quoted, go to this page. If the quote is drafted, go to this other page, so on, right? How are you going to make those pages load? Do you have all the data you need to make those pages load? That's our second question.

So what we saw, quote ID is the only thing we need if you want to load a page. Original design was like when I get the response right here. Okay.

Speed bump, no. Speed bump is just basically a trap. Then I route by job status.

But in between, you know, you see this branch? I want to have another box that is to hydrate my storage. But we don't have it yet because the assumption is like if you navigate to any page, it should do that API call and get the data for you. If you have the primary keys in the storage, like job ID and all.

Is that true? That's not true of all pages and not true of specific pages that build upon the selected state data. But you should be able to fetch all that selected state data by using the quote param. So what I'm saying here is you need to account for some, you have a target route, and that target route uses data that you have to map before you insert it into the API.

And your page that makes this routing decision should also do this mapping, right? The page should say, hey, take me to wherever I'm supposed to go. And then after you take me to where I'm supposed to go, if that where I'm supposed to go needs additional data that you live through the application and you need to fetch it via an API, do it right there as well, right? I don't know what it is, right? But your targets are huge pages. The face pilot page probably doesn't need anything.

The quote results page might not need anything. It's really kind of standalone. But the easiest way to check is just look through what it imports out of the hooks in the application.

Right? Like... But yeah, that should be fine. Sorry, but is there a place today that where we are hydrating the data somewhere like you're launching in between? No. No.

No. There's no middle point. The only place to start the flow is the beginning.

However, every page should be refreshable, and that works. So the question becomes, like, think of our data flow. We have prefilled data, and then we have selected state data, and then we enrich that selected state data.

So to get to selected state data, you need prefilled state data. So loading a page that requires prefilled state data will fetch it. But loading a page that requires selected state data, then how are you going to get that with just a quote ID? Right? Because you don't have a document that gives you that selected state data.

So let's say if I land on the quote result, quote result may not need any of the previous data. But when I navigate to, let's say, additional driver details page, there I may need the selected data. Yes.

Or what if you land on quote result, and then you page back into driver additional info. Sorry, driver details. Right? Driver details for who? You never fetch drivers.

Right? You don't have selected drivers because you started the flow at the halfway point. Right. But anyway, the navigation is not in scope as of today for this PI for us.

Okay. But I want to build something that can be used later also when the navigation comes into picture. So that is how I was thinking of this approach, like having its own route so that whatever processing I need to do, I can just dump all of that in that route.jsx and then go from there.

Or I could do one more thing. When I am in the readout service, I call a hook from the readout service itself. When I am in the readout service, I call a hook from the readout service itself.

Okay. So when I see like it's a resume code flow, I trigger the call from here to the service I want to call, get the response, like do the polling, get the response. And based on the response, whatever Sushmita was showing earlier, have that logic in here.

Like if code status is start, go to code results, if it's coded, go to e-sign. So the apps are a little bit different than that. The way that app processing works is this is independent, right? Because what you're saying is within the app, I want to navigate to a specific page, right? But what this function says is within the system, I want to navigate to a specific app, right? This is the decision point between M1V2 and M1V1.

Yes. Not M1V2 and a different page in M1V2. There's a different function that does that.

Do you have the code base open for acquisition or servicing? You mean in the local? It doesn't matter, just like show me main JSX in acquisition or in servicing. Yeah, right here on the screen. I'm shooting my screen, right? Yes, yes, you are. 

Sometimes people like have this in intelligence easier for themselves. I just don't know how you want to navigate this. Okay, so if you notice at the top, the top-ish, there should be a call, a function call of get initial URL.

Scroll down for me. Feature flag check, feature flag check, metric logger, get inactive. Well, this is weird. 

Oh, because we're using the default router switch branches. Yeah, main.js? Yeah, you're in the right place. You're in the wrong branch. 

Go to coconut, or sorry, not coconut, butterscotch. Coconut was like a year ago at this point. So you're not going to merge to master, right? So the router implementation changed in between master and butterscotch. 

And so let's consider the latest implementation or at least the implementation that more accurately matches your merge target, which, yeah, should be butterscotch. So butterscotch up has, as you scroll, there it is. You see that? Stop, stop, stop. 

A little, right above the feature flag fetching, line 44, something around that. Yeah, so that's get initial URL. So that's within the application, which page am I going to? You handed the entire nav state, you handed your base route, you handed your location, you handed a bunch of stuff, right? And so basically, what's going on here is main files can't be tested. 

Right? I think we can all agree that main files, it's like the Spring Boot application file, like testing that file for anyone. So they keep growing, right? They keep adding, they keep making this action to these files. And that's just unsafe, because it's gonna change, and it's not gonna change in a way that we can test. 

The only people that can test these files is QA, or I guess our integration tests, right? And so I just pull every time I have to do something like this, I pull out logic, I keep pulling out logic, right? But in here, this is a function where you will decide, hey, if I've got this other query command, then I go to my efficient route type page, and I would use, I would move the start date page to slash start date. And I would move this, like your new route to slash. Like the first page that you hit should say, query param check, and off check, and health check, and all of that, that can happen here.

Does that make sense? All right, yes. And so, and that buys us a bunch of stuff, dude, a bunch of stuff. It buys us your implementation having a sane architecture, and it buys us mounting a component, which we can test, where we do all these observable things that we typically squish and make, right? And so all that means is now we can test the loading behavior of our application, which previously we couldn't. 

Correct. Yeah, so that's huge, right? Because we, as this keeps growing, this becomes more and more concerning. Like how many times have you gone to a prod release, and someone's like, oh man, this tiny config change in my API, we have to re-release, right? Spring boot applications have tons of configs, and that's why this is happening. 

React applications don't. If we keep growing this file, we will, and those mistakes are more likely to happen. But yeah, anyway, did that show everything? I'm looking at my solution on the screen then. 

Yep. All right, so I can throw in this logic in here, and what about like calling the hook, I call it from here? No, because getInitialUrl lives in a script that it made, right? There is no hooks. Hooks don't exist yet. 

You haven't even mounted the application. GetInitial? Sorry, go ahead. I may be needing a new route then, right? Yeah, you absolutely need a new route. 

That's why I told you switch startDate to slash startDate. Right now, startDate page is just slash. Switch it to slash startDate, which should be as easy as renaming the constant, and then assign and replace in every single test that works.

And then, make your new page slash, so that everyone hits it. You don't have query params, then I won't make the API call to load a quote. I'll just route you immediately back to slash, or to the startDate page, sorry. 

Which is basically what you were already paying to do. All right, so we can make use of this function to read our parameter, and then route to a new route. Call it, let's say, resumeQuote. 

You can keep it outside of Quote and maybe make a new folder called resumeQuote. And then, in that route, we call our hook, which calls the service to do POST, and then GET, and then any other manipulation. And then, find out for now if there is a speed bump to be shown or not. 

If no speed bump, route it to startDate, because we don't have the other requirement yet. But for the other requirement, Vinny, so when I know where to go, I need to see what data, you know, basically what data those different pages may need? Yes. What is the state of the big store by the time you hit the page? Yeah, you're going to need that.

Okay, that's going to follow. Honestly, it just depends on the application itself, right? Because this is for acquisition, but I'm assuming you're going to have to do something similar for servicing. Right? So, like, in this page, can you show me Quote results in the code you've got open? You mean the route, right? Yeah, the route that is Quote results. 

So, that's going to call shareComponentsQuote results, right? I think I'm a genius for that one. So, most of the code actually lives in Quote results. But if you look here, you see, scroll down a little bit more, stay in the imports, keep showing me the imports. 

There you go. So, the way you look at this is, consider your hooks, the auto-wiring solution in Spring, right? Every time you look at a class in Spring, you say, what does Spring auto-wire? What gets dependency injected? Same thing with hooks, right? I just look at imports, and I look at what gets extracted out of those imports. So, I know there's everything from source hooks, and I say, from this application to load Quote results, we need the data from these three pieces, right? And so, now, which data specifically, scroll down and look at the top of the component. 

So, scroll down a little bit for me. All right. So, now, notice, that's good enough, because you start seeing the effects in here, right? So, from here to here is data declaration that comes from dependency injection. 

From here down, it's effects. So, don't scroll from here. You're good. 

You're good. Just don't scroll anymore. So, now, to load this page, right, to call the page from Common, you need some data points.

Selected vehicles. You need the submission. You need the start date, right? You need all these things that you don't have if you just route directly to this page. 

The thing that concerns me the most here is selected vehicles, right? And so, how are you going to fetch that in your component is that big concern, right? So, you need to do this for every navigation target that you're going to have, because you're eventually going to run out of time.

Yep, yeah, that exists. That in M1 Acquisition V2. Andy wrote that. 

I've been playing with that right now. Right, that's the one that's in the reroute service. Yep, acquisitions have a reroute service and that calls on common code. 

But yeah, I know what you're talking about. You don't have to show me. Right, so here we are routing, right? We're staying in M1 V2.

Right, so just before this, after this, I mean before this, like if I see my parameter, I route them to let's say slash resume code. And that resume code is in route. Let's say I create a new folder and then I call it resume code.

And when I go to that, I run some, you know, interstitial in the user side and then run the hook. And then that hook actually calls my service and client. Okay, and then based on the data, I again do some processing here and then navigation, like navigation.

That's how I navigate to wherever I want to navigate them to. But this particular route does not have any need because it's not going to have any component of its own. It just, you know, routes.

Right, but just because it doesn't have, it does have a component of its own, right? You doing this logic can happen at the page level, right? Like if you really, really think about it, a component is just a hook that returns JSX instead of an object. Right, like if you really, really think about it. Components can call effects, hooks can call effects, right? And so when you say like, hey, we have just a file that returns null and calls a bunch of effects, that's a hook.

And that's fine. You can attempt rendering a hook as if they were components. You should think of them interchangeably, right? Obviously a hook doesn't put anything on the screen, but the life cycle that a component has is the same life cycle that a hook has.

So I don't really have an issue with this approach. What I will say is I have three questions, and this is regardless of which approach you take. This is what I thought you were going to get me about.

The standard approach is what you're describing, right? Like as of the application architecture that we've established, what you're describing is how it should happen. But then, yeah, my questions are, one, okay, you have a routing decision, right? Like the commented out code that I saw whoever was presenting a couple minutes ago, they showed a function that said like if the quote is quoted, go to this page. If the quote is drafted, go to this other page, so on, right? How are you going to make those pages load? Do you have all the data you need to make those pages load? That's our second question.

So what we saw, quote ID is the only thing we need if you want to load a page. Original design was like when I get the response right here. Okay.

Speed bump, no. Speed bump is just basically a trap. Then I route by job status.

But in between, you know, you see this branch? I want to have another box that is to hydrate my storage. But we don't have it yet because the assumption is like if you navigate to any page, it should do that API call and get the data for you. If you have the primary keys in the storage, like job ID and all.

Is that true? That's not true of all pages and not true of specific pages that build upon the selected state data. But you should be able to fetch all that selected state data by using the quote param. So what I'm saying here is you need to account for some, you have a target route, and that target route uses data that you have to map before you insert it into the API.

And your page that makes this routing decision should also do this mapping, right? The page should say, hey, take me to wherever I'm supposed to go. And then after you take me to where I'm supposed to go, if that where I'm supposed to go needs additional data that you live through the application and you need to fetch it via an API, do it right there as well, right? I don't know what it is, right? But your targets are huge pages. The face pilot page probably doesn't need anything.

The quote results page might not need anything. It's really kind of standalone. But the easiest way to check is just look through what it imports out of the hooks in the application.

Right? Like... But yeah, that should be fine. Sorry, but is there a place today that where we are hydrating the data somewhere like you're launching in between? No. No.

No. There's no middle point. The only place to start the flow is the beginning.

However, every page should be refreshable, and that works. So the question becomes, like, think of our data flow. We have prefilled data, and then we have selected state data, and then we enrich that selected state data.

So to get to selected state data, you need prefilled state data. So loading a page that requires prefilled state data will fetch it. But loading a page that requires selected state data, then how are you going to get that with just a quote ID? Right? Because you don't have a document that gives you that selected state data.

So let's say if I land on the quote result, quote result may not need any of the previous data. But when I navigate to, let's say, additional driver details page, there I may need the selected data. Yes.

Or what if you land on quote result, and then you page back into driver additional info. Sorry, driver details. Right? Driver details for who? You never fetch drivers.

Right? You don't have selected drivers because you started the flow at the halfway point. Right. But anyway, the navigation is not in scope as of today for this PI for us.

Okay. But I want to build something that can be used later also when the navigation comes into picture. So that is how I was thinking of this approach, like having its own route so that whatever processing I need to do, I can just dump all of that in that route.jsx and then go from there.

Or I could do one more thing. When I am in the readout service, I call a hook from the readout service itself. When I am in the readout service, I call a hook from the readout service itself.

Okay. So when I see like it's a resume code flow, I trigger the call from here to the service I want to call, get the response, like do the polling, get the response. And based on the response, whatever Sushmita was showing earlier, have that logic in here.

Like if code status is start, go to code results, if it's coded, go to e-sign. So the apps are a little bit different than that. The way that app processing works is this is independent, right? Because what you're saying is within the app, I want to navigate to a specific page, right? But what this function says is within the system, I want to navigate to a specific app, right? This is the decision point between M1V2 and M1V1.

Yes. Not M1V2 and a different page in M1V2. There's a different function that does that.

