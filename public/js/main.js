var socket = io.connect('/');

socket.on('update', function (data) {
	console.log(data);
});

console.log('loaded');
$('.js-unmind-input button').click(function () {
	console.log('clicked');
	var url = $(this).closest('.js-unmind-input').find('input').val();
	socket.emit('create', {url: url});
	console.log('url:', url);
});