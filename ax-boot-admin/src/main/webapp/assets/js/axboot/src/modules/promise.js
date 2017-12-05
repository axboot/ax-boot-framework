axboot.promise = function () {
  /**
   * @Class axboot.promise
   * @example
   * ```js
   * axboot.promise()
   *      .then(function (ok, fail, data) {
    *             $.ajax({
    *                 url: "/api/v1/connections",
    *                 callback: function (res) {
    *                     ok(res); // data 로 전달
    *                 },
    *                 onError: function (res) {
    *                     fail(res);
    *                 }
    *             });
    *         })
   *      .then(function (ok, fail, data) {
    *             $.ajax({
    *                 url: "/api/v1/login",
    *                 data: data,
    *                 callback: function (res) {
    *                     ok(res);
    *                 },
    *                 onError: function (res) {
    *                     fail(res);
    *                 }
    *             });
    *         })
   *      .then(function (ok, fail, data) {
    *             console.log("success");
    *         })
   *      .catch(function (res) {
    *              alert(res.message);
    *      });
   * ```
   */
  const myClass = function () {
    this.busy = false;
    this.queue = [];
    this.then = function (fn) {
      this.queue.push(fn);
      this.exec({});
      return this;
    };
    this.exec = function (data) {
      if (this.busy) return this;
      var Q    = this.queue.shift(),
          self = this;

      if (Q) {
        this.busy = true;

        try {
          Q(
            function (a) {
              self.busy = false;
              self.exec(a);
            },
            function (e) {
              self._catch(e);
            },
            data || {}
          );
        }
        catch (e) {
          this._catch(e);
        }
      } else {
        this.busy = false;
      }
    };
    this.catch = function (fn) {
      this._catch = fn;
    };
  };

  return new myClass();

};