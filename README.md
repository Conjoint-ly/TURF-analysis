# TURF Analysis
TURF Analysis, an acronym for "Total Unduplicated Reach and Frequency", is a type of statistical analysis used for providing estimates of media or market potential and devising optimal communication and placement strategies given limited resources. TURF analysis identifies the number of users reached by a communication, and how often they are reached.

This library is work in progress.

### Installation

```
npm install mathjs --production --prefix ~/environment/
```

### Steps and to-dos

- [x] Search for Reach           
- [x] Allow for Frequency
- [ ] Nice outputs: Each scenario shows:
   - Reach
   - Frequency
   - For each element, unique reach ; Non-unique-reach 
- [x] Encasulate in class or prototype
- [ ] Write interface
   - Free form
   - Prepopulate with combinations of 2
   - Prepopulate with ladder
- [ ] Speed up and test robustness (repeat tests)
- [ ] Place into worker
- [ ] Validation for the interface:
   - col count in each row must be same
   - All values are numeric
   - Test with 1 row only
   - Test with 1 col only 
