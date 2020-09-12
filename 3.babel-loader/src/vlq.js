/***
    2.5 VLQ编码
    VLQ是Variable-length quantity 的缩写，是一种通用的、使用任意位数的二进制来表示一个任意大的数字的一种编码方式
    这种编码需要用最高位表示连续性，如果是1，代表这组字节后面的一组字节也属于同一个数；如果是0，表示该数值到这就结束了
    如何对数值137进行VLQ编码
    将137改写成二进制形式 10001001
    七位一组做分组，不足的补0 0000001 0001001
    最后一组开头补0，其余补1 10000001 00001001
    137的VLQ编码形式为10000001 00001001
*/
let binary = 137..toString(2);
console.log(binary);//10001001
//每7位一分组，不足补0
let padded = binary.padStart(Math.ceil(binary.length / 7) * 7, '0');
console.log(padded);//0000001,0001001
let groups = padded.match(/\d{7}/g); //通过正则匹配补充好的数据
groups = groups.map((group,index)=>(index==0?'1':'0')+group);
console.log(groups);// ['10000001','00001001']

let vlq  = groups.join('');
console.log("得到的vlq编码为:vlq = ", vlq);





