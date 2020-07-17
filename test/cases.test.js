test('async function', (done) => {
    setTimeout(() => {
        expect(1).toBe(1)
        done()
    }, 2000)
})