.. default-domain:: js
.. highlight:: javascript
.. _expectations:

============
Expectations
============

Version:
    N/A (see :ref:`buster-assertions`)
Module:
    ``require("buster-assertions").expect;``
In browsers:
    ``buster.assertions.expect;``

Expectations are an alternate frontend to :ref:`buster-assertions`. The
verification and error messages are the same, but the syntax is different::

    assert.equals({ id: 42 }, { id: 42 });
    expect({ id: 42 }).toEqual({ id: 42 });

    refute.equals({ id: 42 }, { id: 10 });
    expect({ id: 42 }).not.toEqual({ id: 10 });


Expectations
============

Examples assume that you have aliased ``buster.assertions.expect`` as such::

    var expect = buster.assertions.expect;

Refer to the :ref:`buster-assertions` documentation for details on each method.


::

    expect(actual).toBeTrue();

See :func:`expect.toBeTrue`.


::

    expect(actual).toBeFalse();

See :func:`expect.toBeFalse`.


::

    expect(actual).toBeTruthy();

See :func:`expect.toBeTruthy`.


::

    expect(actual).toBeFalsy();

See :func:`expect.toBeFalsy`.


::

    expect(actual).toBe();

See :func:`expect.toBe`.


::

    expect(actual).toEqual();

See :func:`expect.toEqual`.


::

    expect(actual).toBeGreaterThan();

See :func:`expect.toBeGreaterThan`.


::

    expect(actual).toBeLessThan();

See :func:`expect.toBeLessThan`.


::

    expect(actual).toBeString();

See :func:`expect.toBeString`.


::

    expect(actual).toBeObject();

See :func:`expect.toBeObject`.


::

    expect(actual).toBeFunction();

See :func:`expect.toBeFunction`.


::

    expect(actual).toBeBoolean();

See :func:`expect.toBeBoolean`.


::

    expect(actual).toBeNumber();

See :func:`expect.toBeNumber`.


::

    expect(actual).toBeDefined();

See :func:`expect.toBeDefined`.


::

    expect(actual).toBeNull();

See :func:`expect.toBeNull`.


::

    expect(actual).toBeNaN();

See :func:`expect.toBeNaN`.


::

    expect(actual).toBeArray();

See :func:`expect.toBeArray`.


::

    expect(actual).toBeArrayLike();

See :func:`expect.toBeArrayLike`.


::

    expect(actual).toMatch();

See :func:`expect.toMatch`.


::

    expect(actual).toThrow();

See :func:`expect.toThrow`.


::

    expect(actual).toHaveTagName();

See :func:`expect.toHaveTagName`.


::

    expect(actual).toHaveClassName();

See :func:`expect.toHaveClassName`.


::

    expect(actual).toBeNear();

See :func:`expect.toBeNear`.

Also aliased as ``expect(actual).toBeCloseTo();``.


::

    expect(actual).toHavePrototype();

See :func:`expect.toHavePrototype`.


::

    expect(actual).toContain();

See :func:`expect.toContain`.
