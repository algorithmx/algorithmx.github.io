The Use of Mixins in OOP
===

Mixin (mix-in) is a design pattern that "mix a class into another" via multiple inheritance [1] or interface [2]. This post collects my thoughts on this topic, with the help of the answer from perplexity.ai [3] and Kimi [4].

# Purpose 

Factoring out a class and then mix it in is basically for **reusability** and **maintenance**. 

The mindset of designing a mixin is similar to that when ensuring 1NF/2NF/3NF on a relational database. To establish the analogy, think of class members (methods, properties or functions, data) as attributes in the database table. A basic criteria for a mixin is **stateless**, i.e. the class/interface should not own an internal state that changes during its lifecycle. This does not mean that the mixin cannot have data member; it is very common and very helpful for a mixin to have certain **static properties**, which control the behavior of the mixin.


# Practices

## 

# Examples


# Cost

## Implementation complexity

## Performance



# References

- [1] [Multiple inheritance](https://exa.ai/search?q=multiple+inheritance&c=blog+post&filters=%7B%22numResults%22%3A30%2C%22domainFilterType%22%3A%22include%22%2C%22type%22%3A%22auto%22%2C%22useAutoprompt%22%3Atrue%2C%22resolvedSearchType%22%3A%22neural%22%7D&autopromptString=Here+is+a+blog+post+about+multiple+inheritance%3A&resolvedSearchType=neural). 

- [2] [Interface]()

- [3] [Comprehensive Comparison of Mixins in C++, Java, Rust, and Python](https://www.perplexity.ai/search/give-a-comprehensive-review-on-v9rxZffpQfixFO4GPqi9zg#1)

- [4] [比较C++、Java、Rust和Python中Mixins的使用](https://kimi.moonshot.cn/share/csi7s0q1jcjqrrschl7g)

- [4]