// const add = (a, b) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(a + b);
//         }, 2000);
//     })
//     resolve
// }

// const doWork = async () => {
//     const sum = await add(2, 2);
//     const sum1 = await add(sum, 2);
//     const sum2 = await add(sum1, 2);
//     const sum3 = await add(sum2, 2);
//     const sum4 = await add(sum3, 2);
    
// return sum4;    
// }

// doWork().then((result) => {
//     console.log(result);    
// }).catch((error) => {
//     console.log(error);
// })



// check whether sum = 100 or either of the 2 is of value 100
function checkTwoNos(num1 , num2){
    if(num1 == 100 || num2 === 100 || num1 + num2 === 100){
        return true
    }
    else{
        return false
    }
}
// console.log(checkTwoNos(65, 40));


// even nos between 0-1000


const evenArr = () => {
    const arr = new Array(10)
      .map(() => {
        return {
          name: "tanish",
          age: 30
        };
      })
      .fill(80);

//     for(var i = 0; i <= 10; i++){
//         console.log(arr.push(i));              
//     }
    return arr;
}

console.log(evenArr());



// getting extension of a filename

