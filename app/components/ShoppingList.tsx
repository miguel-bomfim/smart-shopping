"use client";

import { useState } from "react";
import { CiCirclePlus, CiTrash, CiCircleCheck } from "react-icons/ci";

interface Item {
  id: number;
  name: string;
  price: string;
}

export default function ShoppingList() {
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const handleAdd = () => {
    if (newItem.name && newItem.price) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ name: "", price: "" });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const handleEdit = () => {
    if (editingItem && editingId) {
      setItems(
        items.map((item) => (item.id === editingId ? editingItem : item))
      );
      setEditingId(null);
      setEditingItem(null);
    }
  };

  if (!showList) {
    return (
      <button
        onClick={() => setShowList(true)}
        className="w-40 h-40 rounded-full text-lg font-medium"
      >
        Nova Lista +
      </button>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-6 text-lg"
        >
          Add <CiCirclePlus className="ml-2" />
        </button>
      ) : (
        <div className="flex flex-col gap-2 p-4 border rounded-lg">
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              document.getElementById("price-input")?.focus()
            }
            placeholder="Nome do item"
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <input
              id="price-input"
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              placeholder="R$"
              className="w-full p-2 border rounded"
            />
            <button onClick={handleAdd}>OK</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            {editingId === item.id ? (
              <>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingItem?.name}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                    className="flex-1 p-2 border rounded"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      document.getElementById(`price-edit-${item.id}`)?.focus()
                    }
                  />
                  <input
                    id={`price-edit-${item.id}`}
                    type="number"
                    value={editingItem?.price}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, price: e.target.value } : prev
                      )
                    }
                    className="w-24 p-2 border rounded"
                    onKeyPress={(e) => e.key === "Enter" && handleEdit()}
                  />
                  <button onClick={handleEdit}>
                    <CiCircleCheck className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span
                  onClick={() => startEditing(item)}
                  className="cursor-pointer"
                >
                  {item.name}
                </span>
                <div className="flex items-center gap-4">
                  <span
                    onClick={() => startEditing(item)}
                    className="cursor-pointer"
                  >
                    R$ {item.price}
                  </span>
                  <CiTrash
                    className="h-5 w-5 cursor-pointer text-red-500"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
