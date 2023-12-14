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
}


// Обработка отправки формы создания заказа
document.getElementById("orderForm").addEventListener("submit", function (event) {
    event.preventDefault();
    // Получаем данные из формы
    var productName = document.getElementById("productName").value;
    var price = document.getElementById("price").value;
    var deadline = document.getElementById("deadline").value;
    var description = document.getElementById("description").value;
    var dataNumber = document.getElementById("dataNumber").value;

    // Создаем новый элемент заказа
    var newOrder = document.createElement("div");
    newOrder.classList.add("order");

    var orderContent = `
	  <p><strong>Название товара:</strong> ${productName}</p>
	  <p><strong>Цена:</strong> ${price}</p>
	  <p><strong>Срок (в днях):</strong> ${deadline}</p>
	  <p><strong>Описание:</strong> ${description}</p>
	  <p><strong>Контакт для свзязи:</strong> ${dataNumber}</p>
	  <button onclick="changeStatus(this)" class="statusIcon bell">🔔</button>
	  <button onclick="deleteOrder(this)" class="deleteButton">Удалить заказ</button>
	`;

    newOrder.innerHTML = orderContent;
    document.getElementById("ordersList").appendChild(newOrder);
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

function deleteOrder(button) {
    var order = button.parentElement;
    order.remove();
}