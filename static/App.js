var contentNode = document.getElementById('contents');
var component = React.createElement(
  'h1',
  null,
  'Hello World'
);
var component2 = React.createElement(
  'h1',
  null,
  'Hello World'
);
ReactDOM.render(component, contentNode);
ReactDOM.render(component2, contentNode);