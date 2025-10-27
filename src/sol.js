class Sol {
  // [!] nomenclature and structure not finalised

  // class that holds static properties and methods that are useful
  // internally within sol library design and implementation

  static CheckTypes(classNameIn, methodName, ...checks) {
    // [!] if type is array then allow comparison of contents

    // a method that performs a simple type check by comparing
    // an object against a class who's constructor should have
    // been used to create it
    // 
    // (check might introduce some overhead but can be disabled
    // by redefining the function to be empty)

    // a "...checks" should be an array containing first the object
    // to check surrounded by braces followed by the name of the
    // class it should be a type of, for example:
    // [{a}, A], [{b}, B], ...

    // className can either be an object (usually this) or a string:
    // if it is an object then retrieve the name of the class used
    // to construct it, otherwise just use the string directly

    let className = (typeof classNameIn === "string") ?
      classNameIn : (classNameIn && classNameIn.constructor) ?
      classNameIn.constructor.name : "";

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
          
          let message = (check[1][0] === null) ? "null" :
            (check[1][0].name) ? check[1][0].name: "";
          
          let pre = " (";
          let post = "";

          for (let i = 1; i < check[1].length; ++i) {
            message += pre;
            message += (check[1][i] === null) ? "or null " :
            (check[1][i].name) ? "or " + check[1][i].name + " " : "";

            pre = "";
            post = ")";
          }

          message = (message === " (") ? "" : message.trimEnd();
          throw new TypeError(`${className} (${methodName}): ` +
          `'${values[0][0]}' ` + ((message !== "") ?
          `should be ${message}${post}` : "is wrong type!"));
        }
      }
    }
  }
};

export default Sol;
