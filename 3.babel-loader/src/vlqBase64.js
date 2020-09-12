/**
 Base64 VLQ

一个Base64字符只能表示6bit(2^6)的数据
Base64 VLQ需要能够表示负数,于是用最后一位来作为符号标志位
由于只能用6位进行存储，而第一位表示是否连续的标志，最后一位表示正数/负数。中间只有4位，因此一个单元表示的范围为[-15,15]，如果超过了就要用连续标识位了
表示正负的方式
如果这组数是某个数值的VLQ编码的第一组字节，那它的最后一位代表"符号"，0为正，1为负；
如果不是，这个位没有特殊含义，被算作数值的一部分
在Base64 VLQ中，编码顺序是从低位到高位,而在VLQ中，编码顺序是从高位到低位
*/

let base64 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
];
/**
 * 1. 将137改写成二进制形式  10001001
 * 2. 127是正数，末位补0 100010010
 * 3. 五位一组做分组，不足的补0 01000 10010
 * 4. 将组倒序排序 10010 01000
 * 5. 最后一组开头补0，其余补1 110010 001000
 * 6. 转64进制 y和I
 */
function encode(num) {
  //1. 将137改写成二进制形式,如果是负数的话是绝对值转二进制
  let binary = Math.abs(num).toString(2);

  //2.正数最后边补0,负数最右边补1,127是正数,末位补0 100010010
  binary = num >= 0 ? binary + "0" : binary + "1";

  //3.五位一组做分组，不足的补0   01000 10010
  let zero = 5 - (binary.length % 5);
  if (zero > 0) {
    binary = binary.padStart(Math.ceil(binary.length / 5) * 5, "0");
  }
  let parts = [];
  for (let i = 0; i < binary.length; i += 5) {
    parts.push(binary.slice(i, i + 5));
  } // 01000 10010


  //4. 将组倒序排序 10010 01000
  parts.reverse(); // ['00000','00001']

  //5. 最后一组开头补0,其余补1 110010 001000
  for (let i = 0; i < parts.length; i++) {
    if (i === parts.length - 1) {
      parts[i] = "0" + parts[i];
    } else {
      parts[i] = "1" + parts[i];
    }
  }

  //6.转64进制 y和I
  let chars = [];
  console.log("parts = ", parts);
  for (let i = 0; i < parts.length; i++) {
    let index = parseInt(parts[i], 2); //二进制转10进制的写法
    console.log("index = ", index);
    chars.push(base64[index]);
  }
  return chars.join("");

}
let result = encode(137);

console.log(result);


