/**
 * Storage Controller
**/
const StorageCtrl = (function() {
	// Public Methods
	return {
		storeItem: function(newItem) {
			let items;

			// Check if any items in local storage
			if(localStorage.getItem('meals') === null || localStorage.getItem('meals') === '') {
				items = [];

				// Push neww item to the array
				items.push(newItem);

				// Set local storage
				localStorage.setItem('meals', JSON.stringify(items));
			} else {
				// Get the existing item as JSON
				items = JSON.parse(localStorage.getItem('meals'));

				// Push new item
				items.push(newItem);

				// Re-set the local storage
				localStorage.setItem('meals', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function() {
			let items;
			if(localStorage.getItem('meals') === null || localStorage.getItem('meals') === '') {
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('meals'));
			}
			return items;
		},
		updateItemStorage: function(updatedItem) {
			let storageItems = JSON.parse(localStorage.getItem('meals'));

			storageItems.forEach(function(item, index) {
				if(updatedItem.id === item.id) {
					storageItems.splice(index, 1, updatedItem);
				}
			});

			// Re-set local storage
			localStorage.setItem('meals', JSON.stringify(storageItems));
		},
		deleteItemFromStorage: function(currenItemID) {
			let storageItems = JSON.parse(localStorage.getItem('meals'));

			storageItems.forEach(function(item, index) {
				if(currenItemID === item.id) {
					storageItems.splice(index, 1);
				}
			});

			// Re-set local storage
			localStorage.setItem('meals', JSON.stringify(storageItems));
		},
		clearAllItemsFromSTorage: function() {
			localStorage.removeItem('meals');
		}
	}
})();

/**
 * Item Controller
**/
const ItemCtrl = (function() {
	// Item Constructor
	const Item = function(id, name, calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	}

	// Data Sturucture / State
	const data = {
		items: StorageCtrl.getItemsFromStorage(),
		currentItem: null,
		totalCalories: 0
	}

	// Public Methods
	return {
		getItems: function() {
			return data.items;
		},
		addItem: function(name, calories) {
			let ID;
			// Create ID
			if(data.items.length > 0) {
				ID = data.items[data.items.length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Convert calories to number
			calories = parseInt(calories);

			// Create new Item
			const newItem = new Item(ID, name, calories);

			// Add to items array
			data.items.push(newItem);

			return newItem;
		},
		getItemByID: function(id) {
			let found = null;

			// Loop through the items
			data.items.forEach(function(item) {
				if(item.id === id) {
					found = item;
				}
			});

			return found;
		},
		updateItem: function(name, calories) {
			// Convert calories to number
			calories = parseInt(calories);

			let found = null;

			data.items.forEach(function(item) {
				if(item.id === data.currentItem.id) {
					item.name = name;
					item.calories = calories;
					found = item;
				}
			});

			return found;
		},
		deleteItem: function(currentItemID) {
			// Get ids
			const IDs = data.items.map(function(item) {
				return item.id;
			});

			// Get the index
			const index  = IDs.indexOf(currentItemID);

			// Remove item 
			data.items.splice(index, 1);
		},
		clearAllItems: function() {
			data.items = [];
		},
		setCurrentItem: function(itemToEdit) {
			data.currentItem = itemToEdit;
		},
		getCurrentItem: function() {
			return data.currentItem;
		},
		getTotalCalories: function() {
			let totalCal = 0;

			// Loop through items and add calories
			data.items.forEach(function(item) {
				totalCal += item.calories;
			});

			// Set total cal in data structure
			data.totalCalories = totalCal;

			// Return total
			return data.totalCalories;
		},
		logData: function() {
			return data;
		}
	}
})();

/**
 * UI Controller
**/
const UICtrl = (function() {
	const UISelectors =  {
		itemList: '#item-list',
		itemListAll: '#item-list li',
		addBtn: '.add-btn',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		clearBtn: '.clear-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		totalCalories: '.total-calories'
	}

	// Public Methods
	return {
		populateItemList: function(items) {
			if(items.length !== 0) {
				let html = '';
				items.forEach(function (item) {
					html += `<li class="collection-item" id="item-${item.id}">
				<strong>${item.name}: </strong>
				<em>${item.calories} Calories</em>
				<a href="#" class="secondary-content">
					<i class="edit-item fa fa-pencil"></i>
				</a>
				</li>`;
				});

				// Insert list items to the UI
				document.querySelector(UISelectors.itemList).innerHTML = html;
			}
		},
		getItemInput: function() {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value
			}
		},
		addListItem: function(item) {
			// Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
			// create li element
			const li = document.createElement('li');
			li.classList.add('collection-item');
			li.id = `item-${item.id}`;
			li.innerHTML = `<strong>${item.name}: </strong>
			<em>${item.calories} Calories</em>
			<a href="#" class="secondary-content">
				<i class="edit-item fa fa-pencil"></i>
			</a>`;

			// Inser Item
			if( document.querySelector(UISelectors.itemList) === null) {

			}
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
		},
		updateListItem: function(updatedItem) {
			let listItems = document.querySelectorAll(UISelectors.itemListAll);
			
			// listItem - node list || USe for...of... loop to loop through it.
			for(let item of listItems) {
				const itemID = item.getAttribute('id');

				// check if the id is === the id of the item updated
				if(itemID === `item-${updatedItem.id}`) {
					document.querySelector(`#${itemID}`).innerHTML = `<strong>${updatedItem.name}: </strong>
					<em>${updatedItem.calories} Calories</em>
					<a href="#" class="secondary-content">
						<i class="edit-item fa fa-pencil"></i>
					</a>`;
				}
			}
		},
		deleteListItem: function(currentItemID) {
			const itemID = `#item-${currentItemID}`;
			const item = document.querySelector(itemID);
			item.remove();
		},
		clearInput: function() {
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		addItemToForm: function() {
			document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},
		removeItems: function() {
			let listItems = document.querySelectorAll(UISelectors.itemListAll); // returns node list

			for(let item of listItems) {
				item.remove();
			}

			document.querySelector(UISelectors.itemList).remove();
		},
		hideList: function() {
			document.querySelector(UISelectors.itemList).style.display = 'none';
		},
		showTotalCalories: function(totalCal) {
			document.querySelector(UISelectors.totalCalories).textContent = totalCal;
		},
		clearEditState: function() {
			// Clear the input 
			UICtrl.clearInput();

			// Hide UPDATE< DELETE & BACK button when not in the EDIT state
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline-block';
		},
		showEditState: function() {
			document.querySelector(UISelectors.updateBtn).style.display = 'inline-block';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline-block';
			document.querySelector(UISelectors.backBtn).style.display = 'inline-block';
			document.querySelector(UISelectors.addBtn).style.display = 'none';
		},
		getUISelectors: function() {
			return UISelectors;
		}
	}
})();

/**
 * App Controller
**/
const App = (function(StorageCtrl, ItemCtrl, UICtrl) {
	// Load event listeners
	const loadEventListeners = function() {
		// Get UI selectors from the UI controllers
		const UISelectors = UICtrl.getUISelectors();

		// Add item event
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

		// Disable submit on enter
		document.addEventListener('keypress', function(e) {
			if(e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
				return false;
			}
		});

		// Edit icon click evet
		document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

		// Update item event
		document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

		// Delete item event
		document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

		// Back button event
		document.querySelector(UISelectors.backBtn).addEventListener('click', function(e) {
			UICtrl.clearEditState();
			e.preventDefault();
		});

		// Clear Items event
		document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
	}

	//Add item submit
	const itemAddSubmit = function(e) {
		// Get the form data
		const input = UICtrl.getItemInput();
		if(input.name !== '' && input.calories !== '') {
			// Add Items
			const newItem = ItemCtrl.addItem(input.name, input.calories);

			// Add Items to the Ui List
			UICtrl.addListItem(newItem);

			// Get the total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total calories to the UI
			UICtrl.showTotalCalories(totalCalories);

			// Store in localStorage
			StorageCtrl.storeItem(newItem);

			// Clear fields
			UICtrl.clearInput();
		}
		e.preventDefault();
	}

	// Click Edit item icon
	const itemEditClick = function (e) {
		// Target the edit button
		if(e.target.classList.contains('edit-item')) {
			// GEt list item ID (item-0, item-1)
			const listID = e.target.parentElement.parentElement.id;
			
			// Get the actual list id number from the id name
			const listIDNum = parseInt( listID.split('-')[1] );

			// Get Item
			const itemToEdit = ItemCtrl.getItemByID(listIDNum);

			// Set current Item
			ItemCtrl.setCurrentItem(itemToEdit);

			// Add item to form
			UICtrl.addItemToForm();
		}

		e.preventDefault();
	}

	// Item update submit
	const itemUpdateSubmit = function(e) {
		// Get item input
		const input = UICtrl.getItemInput();

		// Update item
		const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

		// Update UI
		UICtrl.updateListItem(updatedItem);

		// Get the total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total calories to the UI
		UICtrl.showTotalCalories(totalCalories);

		// Uppdate Local Storage
		StorageCtrl.updateItemStorage(updatedItem);

		// Clear edit state
		UICtrl.clearEditState();

		e.preventDefault();
	}

	// Item delete submit
	const itemDeleteSubmit = function(e) {
		// Get current item
		const currentItem = ItemCtrl.getCurrentItem();

		// Delete the current item from the data structure
		ItemCtrl.deleteItem(currentItem.id);

		// Delete from UI
		UICtrl.deleteListItem(currentItem.id);

		// Get the total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total calories to the UI
		UICtrl.showTotalCalories(totalCalories);

		// Delete from local storage
		StorageCtrl.deleteItemFromStorage(currentItem.id);

		// Clear edit state
		UICtrl.clearEditState();

		e.preventDefault();
	}

	// Clear all items
	const clearAllItemsClick = function(e) {
		// Delete all items from data structure
		ItemCtrl.clearAllItems();

		// Get the total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total calories to the UI
		UICtrl.showTotalCalories(totalCalories);

		// Remove from UI
		UICtrl.removeItems();

		// Clear from local storage
		StorageCtrl.clearAllItemsFromSTorage();

		// Hide UL
		//UICtrl.hideList();

		// Clear edit state
		UICtrl.clearEditState();

		e.preventDefault();
	}

	// Public Methods
	return {
		init: function() {
			// Clear edit state / set initial state
			UICtrl.clearEditState();

			// Ftech Items from Item Controller Data Structure
			const items = ItemCtrl.getItems();

			// Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // Populate the UI list with the items
        UICtrl.populateItemList(items);
      }

			// Get the total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total calories to the UI
			UICtrl.showTotalCalories(totalCalories);

			// Load event listeners
			loadEventListeners();
		}
	}
})(StorageCtrl, ItemCtrl, UICtrl);

// Initializing App
App.init();