class Sol {
  // [!] nomenclature and structure not finalised

  // class that holds static properties and methods that are useful
  // internally within sol library design and implementation

  static minFrameTime = 0.006944; // 1/144 - the shortest time a
  // frame can be displayed for

  static CheckTypes(classNameIn, methodName, ...checks) {
    // [!] if type is array then allow comparison of contents

    // a method that performs a simple type check by comparing
    // an object against a class who's constructor should have
    // been used to create it
    // 
    // (check might introduce some overhead but can be disabled
    // by redefining the function to be empty)

    // a "...checks" should be an array containing first the instance
    // to check surrounded by braces followed by an array of the
    // classes it should be a type of, for example:
    // [{a}, [A]], [{b}, [B, C]], ...

    // className can either be an object (usually this) or a string:
    // if it is an object then retrieve the name of the class used
    // to construct it, otherwise just use the string directly

    let className = Sol._getClassName(classNameIn);

    for (let check of checks) {
      // for all checks assume initially an error has occurred (false)
      // and modify if a match occurs

      let result = false;

      if (check.length >= 2) {
        // object to check has both a label and the actual object
        // the latter of which we are interested in for type checking
        
        let values = Object.entries(check[0]);
        
        for (let i = 0; i < check[1].length; ++i) {
          if (check[1][i] === null && values[0][1] === null) {
            result = true;
          } else if (check[1][i] !== null &&
            values[0][1] instanceof check[1][i]) {

            result = true;
            break;
          }

          // special consideration is required for primitives which
          // are created without use of a constructor

          if (result === false && check[1][i] !== null &&
            ((check[1][i].name === "String" &&
            typeof values[0][1] === "string") ||
            (check[1][i].name === "Number" &&
            typeof values[0][1] === "number"))) {
            
            result = true;
            break;
          }
        }

        if (result === false) {
          // no match has been found which indicates a type
          // error has occurred so throw an error using
          // information automatically pulled from inputs
          // if possible, or a somewhat generic error if not
          
          let msg = Sol._getErrorMessage(check);

          throw new TypeError(`${className} (${methodName}): ` +
          `'${values[0][0]}' ` + ((msg[0] !== "") ?
          `should be of the type '${msg[0]}${msg[1]}'` :
          "is wrong type!"));
        }
      }
    }
  }

  static CheckPrototypes(classNameIn, methodName, ...checks) {
    // similar to type check above but instead of looking at
    // instances matching types we're looking at prototypes to
    // identify inheritance

    // "...checks" should be an array containing first the type
    // to check followed by an array of potential base classes
    // it should be a derived type of, for example:
    // [AA, [A]], [BB, [B, C]], ...
    // (if testing an instance you can pass .constructor instead)

    // everything else is as above

    let className = Sol._getClassName(classNameIn);

    for (let check of checks) {
      let result = false;

      if (check.length >= 2) {
        for (let i = 0; i < check[1].length; ++i) {
          let proto = Object.getPrototypeOf(check[0]);

          while (proto !== null) {
            // climb down the prototype chain until we either
            // find a match or reach null (which is the end of
            // a prototype chain)

            if (proto === check[1][i]) {
              result = true;
              break;
            }

            proto = Object.getPrototypeOf(proto);
          }
          
          // if we successfully found a matching prototype in
          // the chain then we can stop looking

          if (result === true) {
            break;
          }
        }

        if (result === false) {
          let msg = Sol._getErrorMessage(check);

          throw new TypeError(`${className} (${methodName}): ` +
          `'${check[0].name}' ` + ((msg[0] !== "") ?
          `should be derived from '${msg[0]}${msg[1]}'` :
          "is not derived!"));
        }
      }
    }
  }

  static _getClassName(className) {
    return (typeof className === "string") ?
      className : (className && className.constructor) ?
      className.constructor.name : "";
  }

  static _getErrorMessage(check) {
    let result = (check[1][0] === null) ? "null" :
      (check[1][0].name) ? check[1][0].name: "";
    
    let pre = " (";
    let post = "";

    for (let i = 1; i < check[1].length; ++i) {
      result += pre;
      result += (check[1][i] === null) ? "or null " :
      (check[1][i].name) ? "or " + check[1][i].name + " " : "";

      pre = "";
      post = ")";
    }

    result = (result === " (") ? "" : result.trimEnd();
    return [result, post];
  }
};

export default Sol;
