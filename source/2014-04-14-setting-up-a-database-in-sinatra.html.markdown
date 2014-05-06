---
title: Setting up a database in Sinatra, Part 1
subtitle: Creating a running application
date: 2014-04-14 13:39 UTC
tags: Ruby, Sinatra, Sequel
---

Storing information in a database is important if you want to store large amounts of information or for longer than
one visit to a website. Trouble is, with so many moving parts, it can feel like a daunting task -- databases,
migrations, tables -- there's a lot to fold together if you're just starting out as a programmer.

I'll walk through the creation of an online database. First, we'll get things situated on our local
environment. Then, we'll push our new app to an online server on [Heroku](http://www.heroku.com) and setup our database there.
Take one step at a time and [ask me for help on twitter](http://www.twitter.com/scottskender) if you get stuck.

I will use several tools for this project; [Sinatra](http://www.sinatrarb.com) will be our framework, [Sequel](http://sequel.jeremyevans.net/)
 will help us manage our database, [Rack](http://rack.github.io/) will run our server, and we will test everything with [RSpec](https://www.relishapp.com/rspec).
 Finally, [GitHub](http://www.github.com) will house our code.
 It may help to review any of these tools that you are not familiar with.

*Note: I use the command-line / terminal window a lot in this walkthrough. Go [here](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line) for a decent introduction*.

Ok, let's start. Create a folder for your project. I'll call mine ```database-from-scratch```.

In a new terminal window, typing ```mkdir database-from-scratch``` from a project directory
(e.g. ~/projects) will create the folder for this project.

Next let's get a few setup hurdles out of the way. Move into your new directory:
```cd database-from-scratch```, then type ```git init```
to create a git repository.

Now, create your gemfile by typing ```bundle init```. Let's put our required gems into this file. It's time to
open up your editor of choice (I am using [RubyMine](http://www.jetbrains.com/ruby/)).

For this database app, our gemfile should look like this:

```ruby
 source "https://rubygems.org"

 gem 'sinatra', '~> 1.4.5'
 gem 'sequel', '~> 4.9.0'
 gem 'pg', '~> 0.17.1'

 group :test do
   gem 'rspec', '~> 2.14.1'
   gem 'capybara', '~> 2.2.1'
 end
 group :development do
   gem 'rack', '~> 1.5.2'
   gem 'rerun', '~> 0.9.0'
 end
```

See how I separated some gems into test and development groups? This keeps the Heroku server lean by bypassing installation of those gems.

The last setup task is to create our testing platform. I type the command ```rspec --init``` which creates
a spec folder and a ```spec_helper.rb``` file with some helpful configurations. Most importantly, it randomizes the order your tests run,
 ensuring that your tests are independent. Add this code to the ```spec_helper.rb``` file to make our error messages display in the browser:

```ruby
ENV['RACK_ENV'] = 'test'
```

Setup complete! Time for our initial commit. I go online to my [github profile](https://github.com/vandosant) and create a new repository.
Then, I copy the SSH url and paste it into the command ```git remote add origin pasted_url``` and hit enter. Now I can push to github.
 Add your git files and commit. I won't belabor git commands here. If you are confused try reading these useful resources:
 [Try Git](http://try.github.io/levels/1/challenges/1) | [Git Immersion](http://gitimmersion.com/) | [LearnGitBranching](http://pcottle.github.io/learnGitBranching/)

My first commit is [here](https://github.com/vandosant/database-from-scratch/commit/d26d90a72d309809d9a6ed1df172c8dfda57bb30) on GitHub. I threw in a Readme file for good measure.

Next, lets get our basic sinatra app running!

Time to write a test. This is a skeleton test that will just test to see if our app is running. Much of it will be replaced when we write our second test.

In the spec folder, create a new spec file. I called it ```database_from_scratch_spec.rb```

First, add this code to bring in the configurations from our ```spec_helper.rb``` file:

```ruby
require 'spec_helper'
```

We're going to use Capybara to test in our browser.

Capybara allows us to simulate the actions of visitors to our website by writing tests where we visit pages, click on things, type text into forms, and read the contents of the page the test is on.
 Read up on it [here](https://github.com/jnicklas/capybara).

Setup the ```database_from_scratch_spec.rb``` file to use Capybara by adding this code at the top:

```ruby
require 'capybara/rspec'
```

Now, we can write our test below that:

```ruby
feature 'viewing the database contents' do
  scenario 'user can visit the homepage' do
    visit '/'

    expect(page).to have_content "Hello World"
  end
end
```

Notice my feature describes what we are working towards, and the scenario is a specific action within that feature.

Let's run our test with <code>rspec</code> at the command line.

Our first error!
**ArgumentError: rack-test requires a rack application, but none was given**

If you look at the [Capybara docs](https://github.com/jnicklas/capybara) that I linked to earlier, you'll notice that you have to assign Capybara.app to your application file.
Let's fix our error by adding this code to the ```database_from_scratch_spec.rb``` file:

```ruby
Capybara.app = DatabaseApp
```
Here, <code>DatabaseApp</code> is the name we'll use for the class that will manage our app.

Run the tests again with <code>rspec</code>.

We get this error:
**uninitialized constant DatabaseApp (NameError)**

So, we need to create our DatabaseApp class. Create a new file ```database_from_scratch.rb``` in your root directory (the same place as your Gemfile, .rspec, and README files).

Let the tests find this file by adding this to the top of your spec file:

```ruby
require_relative '../database_from_scratch.rb'
```

Create the DatabaseApp class by adding this to your new ```database_from_scratch.rb``` file:

```ruby
class DatabaseApp

end
```

Run the tests again, and we see a "proper" test failure now:

**NoMethodError:**
**undefined method `call' for DatabaseApp:Class**

Notice where the failure occurs in the test. Our class does not have the method required to visit the root of our site.

This can be fixed by letting our class inherit the methods available from Sinatra.

Change the ```database_from_scratch.rb``` file to gain access to the Sinatra methods:

```ruby
require 'sinatra/base'

class DatabaseApp < Sinatra::Application

end
```

Now, we have the call method from Sinatra, which will let our test make progress.

Run the tests again. You should see: **expected to find text "Hello World" in "Not Found"**

This is a good time to open a browser window and see what's going on. In the terminal window, type `rerun rackup`.
Rackup will launch the app on the default browser port, specified on this line:
```[2014-04-14 08:10:23] INFO  WEBrick::HTTPServer#start: pid=25660 port=9292```

So, open your favorite browser (I use **Google Chrome**) and point to **http://localhost:9292**

You should see the default 404 error page that Sinatra gives us. At the bottom is some very helpful information:

```
Try this:
# in database_from_scratch.rb
class DatabaseApp
  get '/' do
    "Hello World"
  end
end
```

Let's take those three lines and add them to our DatabaseApp class. Now, our ```database_from_scratch.rb``` file will look like this:

```ruby
require 'sinatra/base'

class DatabaseApp < Sinatra::Application
  get '/' do
    "Hello World"
  end
end
```
Run ```rspec``` to see how the tests are doing, and they should pass! Double-check the browser window and make sure that the **Hello World**µ message shows up.

Congrats on getting a basic Sinatra app running! ```Git add``` your files and commit them to GitHub.

In part 2, we'll create our database.