# Focused mathematics scope research

## Purpose

This document turns the supplied 2027 mathematics outline into a teachable, reading-first curriculum. The public product remains a general mathematics learning platform. The private source outline is used only as a coverage checklist and is intentionally not named or reproduced in the interface.

The research answers four questions:

1. Which mathematical ideas need explicit coverage?
2. What prerequisite order reduces avoidable confusion?
3. What evidence should count as understanding?
4. How should a 900–1,200 question library be distributed?

## Main findings

- Probability and statistics has the greatest conceptual breadth. It needs roughly half of the initial question library.
- Several labels that look like one topic are actually distinct skills. Joint, marginal, and conditional probability should not share one lesson. The same is true for confidence intervals and the three main families of hypothesis tests.
- Linear algebra should be learned through systems and transformations before abstract vocabulary. Matrix properties become easier when each one is attached to an action on vectors.
- The required calculus scope is narrow but depends heavily on function fluency, algebra, graph reading, and careful domain reasoning.
- General-mathematics extensions are useful, but they must not crowd out the focused first pass. Integration, least squares, convexity, and gradient methods can remain available as enrichment after the core sequence.
- A single broad diagnostic would be tiring and noisy. A staged diagnostic with routing decisions after each cluster is more useful.

## Coverage layers

### Layer A: focused core

These ideas receive complete notes, worked examples, direct practice, mixed practice, transfer questions, and delayed review before the first beta opens.

- Counting and probability rules
- Joint, marginal, conditional, and independent events
- Bayes reasoning
- Random variables, mass functions, densities, and cumulative distributions
- Expectation, variance, covariance, correlation, and conditional forms
- Discrete and continuous distribution families
- Sampling distributions, central limit reasoning, intervals, and tests
- Vector spaces, subspaces, dependence, rank, nullity, and linear systems
- Matrix properties, factorisation, eigenstructure, quadratic forms, projections, and singular values
- Single-variable functions, limits, continuity, differentiability, Taylor approximation, extrema, and optimisation

### Layer B: prerequisite bridges

These are short repair lessons inserted when evidence shows a gap.

- Fractions, ratios, exponents, roots, and logarithms
- Algebraic manipulation and equation solving
- Function notation, composition, inverses, domains, and graphs
- Sets, logical statements, and summation notation
- Coordinate geometry, slope, and interpreting change
- Basic integration only where a continuous density requires it

### Layer C: general mathematics extensions

These support broader learning but are not allowed to delay Layer A.

- Proof patterns
- Geometric and other optional distribution models
- Regression and least squares
- Diagonalisation and symmetric matrix theory beyond the focused minimum
- Antiderivatives, definite integrals, and the fundamental theorem
- Convexity and iterative optimisation methods

## Probability and statistics research map

| Cluster | Learner must be able to | Essential prerequisites | Frequent wrong turn |
| --- | --- | --- | --- |
| Counting | Decide whether order matters; handle repetition and constraints; connect counts to equally likely outcomes | factorials, multiplication principle, sets | choosing a formula from keywords without defining the objects |
| Event language | Build a sample space; use complements, unions, and intersections; distinguish exclusive from independent | sets and notation | treating “cannot happen together” as independence |
| Joint and marginal probability | Read tables and joint functions; sum or integrate out the other variable | event language, sums | adding incompatible cells or marginalising the wrong axis |
| Conditional probability | Restrict the possible world; identify the new denominator; use multiplication rules | fractions, intersections | retaining the original sample-space denominator |
| Bayes reasoning | Reverse a condition; combine priors and likelihoods; check normalisation | conditional probability | confusing the direction of the condition |
| Random variables | Map outcomes to numbers; distinguish values from probabilities | functions, sample spaces | treating a random variable as an event |
| PMF, PDF, and CDF | Validate each representation; convert between density and cumulative probability | sums, basic integration, monotonicity | reading a density height as an interval probability |
| Discrete models | Recognise uniform, Bernoulli, binomial, and Poisson assumptions; compute probabilities and summaries | counting, independence, expectation | applying a named model without checking its assumptions |
| Continuous models | Work with uniform, exponential, normal, standard normal, Student t, and chi-squared families | density, transformations | using a normal table without standardising or choosing the wrong tail |
| Expectation and variance | Compute moments; transform variables; use conditional and total forms | sums, integrals, algebra | assuming expectation distributes through nonlinear functions |
| Dependence measures | Compute covariance and correlation; interpret sign and magnitude | expectation, standardisation | claiming that zero correlation proves independence |
| Descriptive statistics | Choose mean, median, or mode; calculate standard deviation; reason about outliers | arithmetic, data displays | using the mean as the best centre for every shape |
| Sampling distributions | Separate population, sample, statistic, and sampling distribution | random variables, variance | interpreting sample variability as population variability |
| Central limit reasoning | State the approximation target and conditions; standardise a sum or mean | sampling distributions | believing the original data become normally distributed |
| Confidence intervals | Build and interpret an interval; identify standard error and critical value | sampling distributions | saying a realised interval contains a parameter with a stated probability |
| Test logic | State null and alternative; choose a statistic; interpret a p-value; recognise error types | conditional reasoning, tails | treating the p-value as the probability the null is true |
| Z tests | Use the normal reference model for suitable mean and proportion questions | standard normal, test logic | using a z procedure when the required scale assumptions fail |
| T tests | Select a t reference model and degrees of freedom | Student t, test logic | using z critical values when scale is estimated |
| Chi-squared tests | Compute expected counts; assess fit or independence; use degrees of freedom | tables, chi-squared family | using percentages instead of counts in the statistic |

### Probability practice evidence

A retained probability topic should include all of the following:

- one representation task using a table, tree, set diagram, PMF, PDF, or CDF
- one calculation with no method label
- one explanation of assumptions
- one mixed question where a nearby method is tempting but wrong
- one fresh delayed problem after at least seven days

## Linear algebra research map

| Cluster | Learner must be able to | Essential prerequisites | Frequent wrong turn |
| --- | --- | --- | --- |
| Vectors and spaces | Test membership, closure, span, dependence, basis, and dimension | equations, geometry, sets | checking only one subspace condition |
| Matrix operations | Track shapes; multiply as composition; use transpose and partitions | vectors, summation | multiplying entries position by position |
| Special matrices | Recognise orthogonal, projection, and idempotent matrices from definitions and action | multiplication, transpose | memorising a pattern without testing the defining equation |
| Linear systems | Translate to matrix form; eliminate; classify solution sets | equations, matrix arithmetic | dividing by a possible zero pivot or losing a row constraint |
| Gaussian elimination | Choose pivots; record elementary steps; back substitute | systems | treating row operations as column operations |
| LU factorisation | Recover lower multipliers and upper triangular form; solve two triangular systems | elimination | placing elimination multipliers in the wrong sign or position |
| Rank and nullity | Read pivot structure; find bases; apply rank-nullity | row reduction, spaces | counting rows or columns instead of pivots and free variables |
| Determinants | Compute and use determinant properties; connect zero determinant to singularity | elimination, permutations | applying determinant rules to non-square matrices |
| Eigenstructure | Solve the characteristic equation; find eigenspaces; verify eigenpairs | determinant, null space | stopping after finding eigenvalues |
| Projections | Project onto a vector or subspace; build a projection matrix | dot product, orthogonality | omitting the normalising denominator |
| Quadratic forms | Compute xᵀAx; use eigenvalues or principal minors to classify sign | transpose, eigenvalues | confusing element-wise squares with a quadratic form |
| Singular value decomposition | Interpret U, singular values, and V; connect singular values to rank and geometry | eigenstructure, orthogonality | confusing eigenvalues with singular values |

### Linear algebra learning order

Use this dependency chain for the focused first pass:

```text
vectors → matrices → systems → elimination → LU
    ↘ spaces → independence → basis → rank/nullity
matrices → determinant → eigenstructure → quadratic forms
dot product → orthogonality → projections → singular values
```

Each abstract definition should follow a concrete computation. For example, teach null space after solving homogeneous systems, and teach rank after identifying pivots and column-space dimension.

## Calculus and optimisation research map

| Cluster | Learner must be able to | Essential prerequisites | Frequent wrong turn |
| --- | --- | --- | --- |
| Functions | Find domains; read notation; compose; interpret graphs | algebra, inequalities | ignoring domain restrictions after simplification |
| Limits | Evaluate from graphs, algebra, and one-sided behaviour | functions, factoring | substituting into an indeterminate form and stopping |
| Continuity | Check value, limit, and equality at a point | limits | assuming a drawn unbroken curve is sufficient proof |
| Differentiability | Use the limit definition and rules; connect derivative to local change | limits, slope, algebra | assuming continuity guarantees differentiability |
| Taylor approximation | Build low-order approximations and identify the expansion point | derivatives, powers | using derivatives at the wrong centre |
| Extrema | Find candidates, check boundaries, and classify local behaviour | derivatives, domains | checking only where the derivative is zero |
| Single-variable optimisation | Define objective and feasible interval; solve; interpret; check endpoints | functions, extrema | optimising an unconstrained expression that does not model the question |

The focused calculus path does not require a full integration course. Integration remains a bridge for continuous probability and a general-mathematics extension.

## Staged diagnostic design

The diagnostic should stop early when evidence is decisive and preserve “not assessed” for skipped material.

### Stage 1: universal foundations, 8 questions

- fractions and ratios
- exponents and logarithms
- rearranging an equation
- function notation and domain
- reading a graph and slope
- sets and intersections
- summation notation
- one short written explanation

Routing rule: three or more independent errors insert foundation bridges before the focused diagnostic continues.

### Stage 2: subject probes, 18 questions

- probability and statistics: 8
- linear algebra: 6
- calculus and optimisation: 4

Each subject probe contains one representation question, one direct calculation, one transfer question, and one confidence check. Additional items are selected only around uncertain boundaries.

### Stage 3: adaptive boundary checks, at most 10 questions

Use boundary checks to distinguish “forgot a procedure” from “missing a prerequisite.” Examples:

- a conditional probability error followed by a set-intersection and fraction question
- a rank error followed by row-reduction and free-variable questions
- an extrema error followed by derivative and domain questions

The result is a list of supported starting points, prerequisite bridges, and unassessed areas. It is not a single score.

## Question-library allocation

The first complete bank should target 1,000 reviewed questions. The lower release threshold remains 900 so rejected or retired questions do not block deployment.

| Area | Target | Direct | Mixed | Transfer | Delayed review |
| --- | ---: | ---: | ---: | ---: | ---: |
| Probability and statistics | 440 | 176 | 110 | 88 | 66 |
| Linear algebra | 300 | 120 | 75 | 60 | 45 |
| Calculus and optimisation | 150 | 60 | 38 | 30 | 22 |
| Foundation bridges | 110 | 44 | 28 | 22 | 16 |
| Total | 1,000 | 400 | 251 | 200 | 149 |

These are library targets, not daily quotas. A daily session should prefer fewer questions with full correction over many unchecked answers.

### Difficulty distribution

- 35% direct: the method is clear, but execution still matters
- 35% mixed: the learner must choose among nearby methods
- 20% transfer: a familiar idea appears in a new representation or context
- 10% diagnostic traps: a plausible misconception produces a meaningful distractor

Every lesson needs at least two parallel fresh forms so a repaired mistake is not tested by repeating the identical numbers.

## Reading-first lesson pattern

For a 12-minute note:

1. **Recall, 1 minute:** one prerequisite prompt before reading.
2. **Mental model, 2 minutes:** the idea in plain language and one visual representation.
3. **Worked example, 3 minutes:** every decision named, not merely every algebra line shown.
4. **Prediction, 1 minute:** commit to a denominator, sign, dimension, tail, or method.
5. **Faded example, 3 minutes:** the learner supplies the missing decisions.
6. **Explain back, 2 minutes:** state when the idea applies and name one tempting misuse.

The practice session then uses direct, mixed, and transfer questions. Reading alone never marks a topic retained.

## Misconception priorities

Author feedback around these high-value distinctions first:

- independent versus mutually exclusive
- density height versus interval probability
- random variable value versus probability
- population distribution versus sampling distribution
- confidence level versus probability about a fixed parameter
- p-value versus probability that a hypothesis is true
- matrix multiplication versus element-wise multiplication
- row space, column space, and null space
- rank versus matrix size
- eigenvalues versus singular values
- continuity versus differentiability
- local versus global extrema
- stationary point versus optimum

## Content production order

### Sprint 1: shared foundations and probability language

Counting, event operations, probability rules, conditional probability, independence, Bayes reasoning, random variables, PMF/PDF/CDF, and descriptive statistics.

### Sprint 2: systems and vector spaces

Matrix arithmetic, systems, elimination, LU, spaces, dependence, basis, rank, and nullity.

### Sprint 3: distributions and moments

Discrete and continuous families, expectation, variance, conditional forms, covariance, correlation, and central limit reasoning.

### Sprint 4: inference

Sampling distributions, confidence intervals, test logic, z procedures, t procedures, and chi-squared procedures.

### Sprint 5: matrix structure

Special matrices, determinants, eigenstructure, projections, quadratic forms, and singular value decomposition.

### Sprint 6: calculus and optimisation

Functions, limits, continuity, derivatives, Taylor approximation, extrema, and constrained single-variable models.

Each sprint ends with a mixed checkpoint and content review before the next sprint begins.

## Source strategy

Learning notes and questions should be original. External materials are references for scope, definitions, and independent checking; they are not copied into the product.

- [OpenStax Introductory Statistics](https://openstax.org/books/introductory-statistics/pages/preface) provides an openly accessible sequence for descriptive statistics, probability, random variables, distributions, intervals, tests, and chi-squared procedures. Confirm the licence displayed on the exact edition and page before adapting any text or assessment.
- [MIT OpenCourseWare Linear Algebra syllabus](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/syllabus/) provides a coherent computational-to-conceptual sequence through elimination, LU, spaces, projections, eigenstructure, quadratic forms, and singular value decomposition.
- [MIT OpenCourseWare Linear Algebra calendar](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/calendar/) is useful for checking prerequisite order and separating large labels into teachable sessions.
- [MIT OpenCourseWare Single Variable Calculus syllabus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/syllabus/) supports the sequence from functions and limits through derivatives, approximation, extrema, and optimisation.
- [MIT OpenCourseWare applications of differentiation](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/) provides a useful distinction between local approximation, graph reasoning, and optimisation problems.
- [MIT OpenCourseWare terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/) currently describe a CC BY-NC-SA licence. Linking is safe; adaptation requires attribution, non-commercial use, and share-alike compliance.

For a future commercial product, prefer original explanations and questions informed by mathematical facts, and use external links for optional reading. Have any adapted material reviewed for licence compatibility before release.

## Research-to-build changes

This research produced the following curriculum changes:

- split permutations from combinations
- split event exclusivity from independence
- split joint and marginal probability from conditional probability
- added explicit PMF, PDF, CDF, conditional distribution, and conditional moment lessons
- added standard normal, Student t, and chi-squared distribution lessons
- split generic hypothesis testing into test logic, z, t, and chi-squared procedures
- added partitioned, orthogonal, idempotent, and projection matrices
- added Gaussian elimination, LU factorisation, nullity, rank-nullity, and quadratic forms
- changed the beta threshold from a fixed lesson count to every mapped lesson

The curriculum now maps 110 micro-lessons. That number may change when content review shows that a lesson is too broad or two lessons are inseparable, but stable lesson IDs should be preserved once learner attempts exist.

## Definition of coverage complete

An area is not complete merely because its title appears in the map. It is complete only when:

- every mapped lesson passes the content schema
- every lesson has two worked examples and one faded example
- every lesson has direct, mixed, transfer, and delayed-review questions
- every distractor maps to a plausible misconception
- every solution is independently recalculated
- symbolic alternatives are tested where relevant
- sources and licences are recorded
- prerequisite links form an acyclic graph
- keyboard and mobile rendering pass review
- no answer key reaches the browser before submission

The content threshold should stay locked until all of these conditions are met.
