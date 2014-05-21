---
title: I love you each, but I've chosen map
date: 2014-05-15 03:13 UTC
tags: Ruby
---

The thing is, each, you are selfish. If I give you something to change, you don't show me what it became unless I force you.

An example:

*Note: I am using irb, a command-line tool for writing Ruby, which results in extra characters at the start of every line.*

First, we create a simple array:

```ruby
:001 > x = [1, 2, 3]
 => [1, 2, 3]
```

Alright, now we have x representing an array with some numbers.

I want to double each number in the array. So, we're looking for an array like this: [2, 4, 6]

First, with each:

```ruby
:002 > y = x.each { |num| num = num * 2 }
 => [1, 2, 3]
:003 > y
 => [1, 2, 3]
```

Crap, we got the original array back. Variable y is the same as our original array!

In some dusty place in my computer, our array was doubled, but we never got the finished product back.

Some handholding is required to get the results from an operation with each:

```ruby
:004 > result = []
 => []
:005 > x.each do |num|
:006 >     result << num * 2
:007?>   end
  => [1, 2, 3]
:008 > result
  => [2, 4, 6]
```

I created an empty array result and shoveled the doubled numbers, one at a time, into it with <<. At the
 end of the operation, the result array holds the finished product.

Using this method to modify arrays and get the results works well, but after using this countless times, it became tedious.
That's when I was shown to the map method by my teachers.

Map is, by all practical purposes, similar to each. The major difference is that map returns a new array with the altered
results, not the original array that it started with.

This means you don't need to shovel stuff into an empty array.

Here's the above example with map instead of each:

```ruby
:005 > y = x.map { |num| num * 2 }
 => [2, 4, 6]
:006 > y
 => [2, 4, 6]
```

There, that feels better, doesn't it?

Now, go forth and clean up the world!