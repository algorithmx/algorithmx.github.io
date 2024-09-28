Learning Typescript
===

Typescript is a superset of Javascript and is used to develop large-scale web applications. 

# Language Features

Typescript has the following language features that I think helpful to write complex programs:
1. [iterator and generator](https://www.perplexity.ai/search/provide-concise-examples-of-it-gCPIG41jT1mHLXytMVaW2g#0)
2. class `implements` interface `extends` parent
3. [type generics](https://www.perplexity.ai/search/detailed-explanation-on-type-g-TlUg_34OTfO_YZMXym6yfg#0)
4. [promise](https://www.perplexity.ai/search/give-an-instructive-explanatio-WDfQNiCPR9iwg_B94UWtqg#0)
5. data member protection: `readonly`, [getter and setter](https://www.perplexity.ai/search/explain-getter-and-setter-of-d-aINdXnAYQyqoN3cwdgsaTQ#0)

The above links to [perplexity.ai](https://www.perplexity.ai/) should be a crash course on Typescript for an experienced programmer. 

## Type

The headache of programming in a disciplined language is much better than the brain damage suffered in debugging a type-free language. Javascript vs Typescript is an example. By introducing type into the language, many modern programming language concepts are appreciated. I would say

$${\rm Type} = \frac{\rm Typescript}{\rm Javascript}$$

Let us look into details.


# Workflow

Workflow is important in the era of programming copilot. 
It determines on a high level the sequence of incremental developments in a project, hence providing a meaningful context to the copilot at any time during the development progress. Copilot is essentially copy-paste from other's solutions. When programming with a copilot, there is a tendency of rushing too quickly to the apparent solution without preparation. Reflecting on my own experience, I have to make my hands dirty only when the copilot fails to resolve difficult bugs due to complicated context. These bugs are often introduced in a hurry. 

## Typical workflow 

```mermaid
graph LR;
    A["npm init"]-->B;
```

## Modules

xx

## Transferring from Javascript to Typescript

Do not underestimate the amount of work before you decide to transfer from Javascript to Typescript, even with the help of a copilot (or your colleagues / employees). The crucial work is to **design** the type system that is compatible with the old Javascript code. 

A typical workflow of renovate a Javascript project, with a copilot, is very similar to that when we start a new Typescript project. Below are a few pieces of experience I would like to share:
1. properly initialize the Typescript project with compatible `package.json` file
2. find out the Typescript counterparts of each package in the dependencies
3. figure out how to import the packages in the Typescript code
4. try to sort out the version conflicts as early as possible
5. instruct the copilot to translate the framework and leave details to later stages
6. compile and run the project in an incomplete status
7. fill in the details 

# React and Vue
