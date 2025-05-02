import { networkInterfaces } from 'os';
import { qr } from 'headless-qr';

const address = networkInterfaces().en0.find(
	(i) => i.family === 'IPv4'
).address;

const qr_code = qr(`http://${address}:8080/main.lynx.bundle?fullscreen=true`, {
	version: 4,
});

const WHITE_BLACK = '▀';
const BLOCK_WHITE = '▄';
const WHITE_WHITE = '█';
const BLACK_BLACK = ' ';

let code =
	Array.from({ length: qr_code.length + 4 })
		.fill(WHITE_WHITE)
		.join('') + '\n';

for (let row = 0; row < qr_code.length; row += 2) {
	let two_rows = WHITE_WHITE + WHITE_WHITE;
	let row_one = qr_code[row];
	let row_two =
		qr_code[row + 1] ?? Array.from({ length: qr_code.length }).fill(false);
	for (let col = 0; col < qr_code.length; col++) {
		let col_one = row_one[col];
		let col_two = row_two[col];
		if (col_one && col_two) {
			two_rows += BLACK_BLACK;
		} else if (col_one && !col_two) {
			two_rows += BLOCK_WHITE;
		} else if (!col_one && col_two) {
			two_rows += WHITE_BLACK;
		} else {
			two_rows += WHITE_WHITE;
		}
	}
	code += two_rows + WHITE_WHITE + WHITE_WHITE + '\n';
}
code += Array.from({ length: qr_code.length + 4 })
	.fill(WHITE_WHITE)
	.join('');

console.log(code);
