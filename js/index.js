let $screen = $("#screen");

$("span").click(function() {
  if ($(this).text() === 'C') {
    $screen.text('');
  } else if ($(this).text() === '=' && $screen.text() !== 'Error') {
    let isError = false;
    let operands = ['+', '-', 'x', '÷'];
    let arrStr = $screen.text().split('');
    // does string start with operator
    if (operands.includes(arrStr[0])) {
      isError = true;
    }
    // do operators occur next to each other
    for (var i = 1; i < arrStr.length; i++) {
      if (operands.includes(arrStr[i]) && operands.includes(arrStr[i - 1])) {
        isError = true;
      }
    }
    // does string end with operator
    if (operands.includes(arrStr[arrStr.length - 1])) {
      isError = true;
    }
    // if there is '/', is it followed by '0'
    for (var i = 1; i < arrStr.length; i++) {
      if (arrStr[i] === '÷' && arrStr[i + 1] === '0') {
        isError = true;
      }
    }

    if (!isError) {
      let cleanStr = $screen.text();
      while (cleanStr.indexOf('÷') !== -1) {
        cleanStr = cleanStr.replace('÷', '/');
      }
      while (cleanStr.indexOf('x') !== -1) {
        cleanStr = cleanStr.replace('x', '*');
      }
      let final = solveScreen(cleanStr);
      if(final.toString().length > 15){
        $screen.text(final.toString().substring(0,14));
      }
      else{
        $screen.text(final);
      }
    } else {
      $screen.text('Error');
    }
  } else if ($screen.text() !== 'Error') {
    $screen.text($screen.text() + $(this).text());
  }

});

function solveScreen(strExp) {
  strExp = strExp.split('');
  let newArr = [];
  let tempVal = '';
  let operands = ['+', '-', '*', '/'];
  for (var i = 0; i < strExp.length; i++) {
    if (operands.includes(strExp[i])){
      newArr.push(tempVal);
      newArr.push(strExp[i]);
      tempVal = '';
    } else {
      tempVal += strExp[i];
    }
  }
  newArr.push(tempVal);
  return calculateOperations(newArr);
}

function calculateOperations(organizedArr) {
  if (organizedArr.length === 1) {
    return organizedArr[0];
  }
  //edge case for order when * and / are included.
  if (organizedArr.includes('*') && organizedArr.includes('/')) {
    if(organizedArr.indexOf('*') < organizedArr.indexOf('/')){
      return calculateOperations(solveSegment(organizedArr,'*'));
    }
    else{
      return calculateOperations(solveSegment(organizedArr,'/'));
    }
  }

  if (organizedArr.includes('*')) {
    return calculateOperations(solveSegment(organizedArr,'*'));
  }
  if (organizedArr.includes('/')) {
    return calculateOperations(solveSegment(organizedArr,'/'));
  }
  if (organizedArr.includes('+')) {
    return calculateOperations(solveSegment(organizedArr,'+'));
  }
  if (organizedArr.includes('-')) {
    return calculateOperations(solveSegment(organizedArr,'-'));
  }
}

  function solveSegment(seg,op){
    let newArr = [];
    newArr.push(seg.slice(0, seg.indexOf(op) - 1));
    if(op === '*'){
      newArr.push(seg[seg.indexOf(op) - 1] * seg[seg.indexOf(op) + 1]);
    }
    if(op === '/'){
      newArr.push(seg[seg.indexOf(op) - 1] / seg[seg.indexOf(op) + 1]);
    }
    if(op === '+'){
      newArr.push(parseInt(seg[seg.indexOf(op) - 1]) + parseInt(seg[seg.indexOf(op) + 1]));
    }
    if(op === '-'){
      newArr.push(parseInt(seg[seg.indexOf(op) - 1]) - parseInt(seg[seg.indexOf(op) + 1]));
    }
    newArr.push(seg.slice(seg.indexOf(op) + 2));
    //flatten the array before passing it back.
    newArr = newArr.reduce(function(a, b) {
        return a.concat(b);
      }, []);
    return newArr;
  }
