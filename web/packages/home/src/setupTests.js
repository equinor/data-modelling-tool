// plotly lib has a reference to window.URL.createObjectUrl.
window.URL.createObjectURL = jest.fn()

HTMLCanvasElement.prototype.getContext = jest.fn()
