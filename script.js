// Отображение выбранной вкладки
function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

	if (tabName === 'viewOrders') update_orders();
}

// Обработка отправки формы создания заказа
document.getElementById("orderForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	// Получаем данные из формы
	var productName = await document.getElementById("productName").value;
	var price = await document.getElementById("price").value;
	var deadline = await document.getElementById("deadline").value;
	var description = await document.getElementById("description").value;
	var dataNumber = await document.getElementById("dataNumber").value;

	document.getElementById('create_order').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
	document.getElementById('create_order').disabled = true;
	var data = await get_orders()
	var count = await data['count'];
	data['count'] += 1;

	data['orders'].push({
		'id': count+'_order',
		'name': productName,
		'price': price,
		'deadline': deadline,
		'dataNumber': dataNumber,
		'description': description,
		'status': '🔔'
	})
	post_order(data);

	document.getElementById('create_order').innerHTML = 'Создать заказ';
	document.getElementById('create_order').disabled = false;

	event.target.reset(); 
	var successMessage = document.getElementById("successMessage");
	successMessage.classList.add("show");
	setTimeout(function() {
		successMessage.classList.remove("show");
	}, 2000); 
});


// Функция для изменения иконки статуса
function changeStatus(button) {
	var statusIcon = button;
	var order = statusIcon.parentElement;

	if (statusIcon.classList.contains("bell")) {
		statusIcon.innerHTML = "⏱"; // Иконка часов
		statusIcon.classList.remove("bell");
		statusIcon.classList.add("clock");
	} else if (statusIcon.classList.contains("clock")) {
		statusIcon.innerHTML = "✓"; // Иконка галочки
		statusIcon.classList.remove("clock");
		statusIcon.classList.add("check");
		order.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
	} else if (statusIcon.classList.contains("check")) {
		statusIcon.innerHTML = "⏱"; // Иконка часов
		statusIcon.classList.remove("bell");
		statusIcon.classList.add("clock");
		order.style.backgroundColor = "rgba(0, 0, 0, 0)";
	}
}

// Функция для удаления заказа
async function deleteOrder(button) {
	var order = button.parentElement;

	document.getElementById(order.id+'_button').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
	document.getElementById(order.id+'_button').disabled = true;

	var data = await get_orders();

	for (let index = 0; index < data['orders'].length; index++) {
		const element = data['orders'][index];

		if (element.id === order.id) data['orders'].splice(index, 1);
	};

	post_order(data);

	document.getElementById(order.id+'_button').innerHTML = 'Удалить заказ';
	document.getElementById(order.id+'_button').disabled = false;
	order.remove();
}

function post_order(data) {
	fetch("https://api.jsonbin.io/v3/b/657b1eb8266cfc3fde68c9c8", {
		method: "PUT",
		headers: {
			'Content-Type': 'application/json',
  			'X-Master-Key': '$2a$10$VRXGCyTWnVAEHhGUxiK3du2G2QHzZyIa9CCEZtYaD4Q3yglt7qWJO'
		},
		body: JSON.stringify(data)
	});
}

async function get_orders() {
	var request = await fetch("https://api.jsonbin.io/v3/b/657b1eb8266cfc3fde68c9c8", {
		method: "GET",
		headers: {
			'X-Master-Key': '$2a$10$VRXGCyTWnVAEHhGUxiK3du2G2QHzZyIa9CCEZtYaD4Q3yglt7qWJO'
		}
	});
	const json = await request.json()
	return json['record']
} 


async function update_orders() {
	document.getElementById('loadingIcon').style.display = 'inline-block';

	document.getElementById("ordersList").innerHTML = ""

	var data = await get_orders()
	var data_orders = await data['orders']

	document.getElementById('loadingIcon').style.display = 'none';

	data_orders.forEach(element => {
		var orderContent = `
			<p><strong>Название заказа:</strong> ${element.name}</p>
			<p><strong>Цена:</strong> ${element.price} ₽</p>
			<p><strong>Срок (в днях):</strong> ${element.deadline}</p>
			<p><strong>Контакт для свзязи:</strong> ${element.dataNumber}</p>
			<p><strong>Описание:</strong> ${element.description}</p>
			<button onclick="changeStatus(this)" class="statusIcon bell">${element.status}</button>
			<button onclick="deleteOrder(this)" class="deleteButton" id="${element.id}_button">Удалить заказ</button>
		`;
		var newOrder = document.createElement("div");
		newOrder.classList.add("order");
		newOrder.id = element.id

		newOrder.innerHTML = orderContent;
		document.getElementById("ordersList").appendChild(newOrder);
	});
	
}
