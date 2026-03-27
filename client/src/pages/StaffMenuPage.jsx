import { useEffect, useState } from "react";
import {
  Soup,
  Search,
  Filter,
  BadgeDollarSign,
  CircleCheck,
  CircleOff,
  PencilLine,
  Trash2,
  X,
} from "lucide-react";
import api from "../api/axios";
import StaffHeader from "../components/StaffHeader";

const CSS = `
  .menu-shell{min-height:100vh;padding:86px 24px 24px}
  .menu-wrap{width:min(1180px,100%);margin:0 auto}
  .menu-card{
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03));
    border:1px solid rgba(255,255,255,.08);
    border-radius:28px;
    backdrop-filter:blur(18px);
    box-shadow:0 18px 45px rgba(0,0,0,.28);
  }
  .menu-head{padding:24px;border-bottom:1px solid rgba(255,255,255,.06)}
  .menu-title{
    display:flex;align-items:center;gap:10px;
    font-family:'Manrope',sans-serif;font-size:28px;font-weight:900;color:#fff;letter-spacing:-.8px;
  }
  .menu-sub{margin-top:8px;font-size:14px;color:rgba(255,255,255,.52);line-height:1.7}
  .toolbar{
    display:grid;grid-template-columns:1.2fr .8fr;gap:12px;
    padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.06);
  }
  .add-form{
    margin:20px 24px 0;
    padding:18px;
    border-radius:20px;
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.06);
    display:grid;
    gap:12px;
  }
  .form-grid-2{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
  }
  .form-input-plain{padding-left:14px !important}
  .form-textarea{
    padding-left:14px !important;
    min-height:90px;
    resize:vertical;
  }
  .checkbox-row{
    display:inline-flex;
    align-items:center;
    gap:8px;
    color:#fff;
    font-size:13px;
    font-weight:700;
  }
  .form-actions{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
  }
  .modal-backdrop{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.72);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:1000;
    padding:20px;
    backdrop-filter:blur(8px);
  }
  .modal-card{
    width:100%;
    max-width:640px;
    background:#0d1130;
    border:1.5px solid rgba(245,166,35,.18);
    border-radius:24px;
    padding:22px;
    box-shadow:0 24px 80px rgba(0,0,0,.6);
  }
  .modal-head{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:12px;
    margin-bottom:14px;
  }
  .modal-title{
    font-size:20px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
    margin-bottom:6px;
  }
  .modal-sub{
    font-size:13px;
    color:rgba(255,255,255,.55);
    line-height:1.7;
  }
  .icon-btn{
    width:38px;
    height:38px;
    border-radius:12px;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.08);
    color:#fff;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    flex-shrink:0;
  }
  .btn-gold{
    padding:10px 14px;
    border-radius:12px;
    background:rgba(245,166,35,.12);
    border:1px solid rgba(245,166,35,.24);
    color:#F5A623;
    font-size:12px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    cursor:pointer;
  }
  .btn-success{
    padding:10px 14px;
    border-radius:12px;
    background:rgba(34,197,94,.12);
    border:1px solid rgba(34,197,94,.24);
    color:#4ade80;
    font-size:12px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    cursor:pointer;
  }
  .btn-secondary{
    padding:10px 14px;
    border-radius:12px;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.08);
    color:#fff;
    font-size:12px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    cursor:pointer;
  }
  .btn-danger{
    padding:10px 14px;
    border-radius:12px;
    background:rgba(239,68,68,.10);
    border:1px solid rgba(239,68,68,.24);
    color:#f87171;
    font-size:12px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    cursor:pointer;
  }
  .btn-success:disabled,.btn-gold:disabled,.btn-secondary:disabled,.btn-danger:disabled{
    cursor:not-allowed;
    opacity:.6;
  }
  .input-wrap{position:relative}
  .input-icon{
    position:absolute;left:13px;top:50%;transform:translateY(-50%);
    color:rgba(255,255,255,.34);pointer-events:none
  }
  .input, .select{
    width:100%;padding:12px 14px 12px 40px;border-radius:14px;background:rgba(255,255,255,.045);
    border:1.5px solid rgba(255,255,255,.08);color:#fff;font-size:14px;outline:none;
  }
  .select{appearance:none}
  .select option{background:#0d1130;color:#fff}
  .menu-list{display:grid;gap:14px;padding:20px 24px}
  .menu-item-card{
    padding:16px;border-radius:20px;background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.06);
  }
  .menu-top{
    display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;
    margin-bottom:10px;
  }
  .menu-name{
    font-family:'Manrope',sans-serif;font-size:17px;font-weight:900;color:#fff
  }
  .menu-meta{display:flex;gap:8px;flex-wrap:wrap}
  .pill{
    display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;
    font-size:11px;font-weight:800;font-family:'Manrope',sans-serif;
    border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#fff;
  }
  .grid{
    display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:10px
  }
  .mini{
    padding:12px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)
  }
  .mini-label{font-size:11px;color:rgba(255,255,255,.42);text-transform:uppercase;font-weight:700;letter-spacing:.5px}
  .mini-value{margin-top:6px;font-size:13px;color:#fff;font-weight:800;font-family:'Manrope',sans-serif}
  .desc-box{
    margin-top:12px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)
  }
  .desc-title{font-size:12px;font-weight:800;color:rgba(255,255,255,.7);font-family:'Manrope',sans-serif;margin-bottom:6px}
  .desc-text{font-size:13px;color:rgba(255,255,255,.58);line-height:1.7}
  .empty, .msg{
    margin:20px 24px;padding:16px;border-radius:16px;font-size:13px
  }
  .empty{
    background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.08);color:rgba(255,255,255,.48)
  }
  .msg.error{
    background:rgba(239,68,68,.10);border:1px solid rgba(239,68,68,.22);color:#f87171
  }
  @media (max-width:900px){
    .toolbar{grid-template-columns:1fr}
    .grid{grid-template-columns:1fr 1fr}
  }
  @media (max-width:640px){
    .menu-shell{padding:82px 16px 16px}
    .grid,.form-grid-2{grid-template-columns:1fr}
    .menu-head,.toolbar,.menu-list{padding-left:16px;padding-right:16px}
    .add-form{margin:20px 16px 0}
  }
`;

const CATEGORY_LABELS = {
  rice_curry: "Rice & Curry",
  kottu: "Kottu",
  fried_rice: "Fried Rice",
  additional_curries: "Additional Curries",
  meats: "Meats",
  chopsuey_sides: "Chopsuey & Sides",
  beverages: "Beverages",
};

const formatCategory = (category) => CATEGORY_LABELS[category] || category || "—";

export default function StaffMenuPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "rice_curry",
    tags: "",
    isAvailable: true,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editItemId, setEditItemId] = useState("");
  const [editItem, setEditItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "rice_curry",
    tags: "",
    isAvailable: true,
  });
  const [availabilityLoadingId, setAvailabilityLoadingId] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteItemName, setDeleteItemName] = useState("");

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/menu");
      setItems(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load menu items.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditItemChange = (field, value) => {
    setEditItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetNewItemForm = () => {
    setNewItem({
      name: "",
      price: "",
      description: "",
      category: "rice_curry",
      tags: "",
      isAvailable: true,
    });
    setAddError("");
    setAddSuccess("");
  };

  const resetEditItemForm = () => {
    setEditItemId("");
    setEditItem({
      name: "",
      price: "",
      description: "",
      category: "rice_curry",
      tags: "",
      isAvailable: true,
    });
    setEditError("");
    setEditSuccess("");
  };

  const openEditModal = (item) => {
    setEditItemId(item._id);
    setEditItem({
      name: item.name || "",
      price: item.price ?? "",
      description: item.description || "",
      category: item.category || "rice_curry",
      tags: item.tags?.join(", ") || "",
      isAvailable: item.isAvailable !== false,
    });
    setEditError("");
    setEditSuccess("");
    setShowEditModal(true);
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    try {
      setAddLoading(true);
      setAddError("");
      setAddSuccess("");

      const payload = {
        name: newItem.name.trim(),
        price: Number(newItem.price),
        description: newItem.description.trim(),
        category: newItem.category,
        tags: newItem.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isAvailable: newItem.isAvailable,
      };

      await api.post("/menu", payload);

      setAddSuccess("Menu item added successfully.");
      resetNewItemForm();
      setShowAddForm(false);
      await fetchMenuItems();
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add menu item.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditMenuItem = async (e) => {
    e.preventDefault();

    try {
      setEditLoading(true);
      setEditError("");
      setEditSuccess("");

      const payload = {
        name: editItem.name.trim(),
        price: Number(editItem.price),
        description: editItem.description.trim(),
        category: editItem.category,
        tags: editItem.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isAvailable: editItem.isAvailable,
      };

      await api.put(`/menu/${editItemId}`, payload);

      setEditSuccess("Menu item updated successfully.");
      setShowEditModal(false);
      resetEditItemForm();
      await fetchMenuItems();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update menu item.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      setAvailabilityLoadingId(item._id);
      setAvailabilityError("");

      const payload = {
        name: item.name,
        price: Number(item.price),
        description: item.description || "",
        category: item.category,
        tags: item.tags || [],
        isAvailable: !item.isAvailable,
      };

      await api.put(`/menu/${item._id}`, payload);
      await fetchMenuItems();
    } catch (err) {
      setAvailabilityError(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setAvailabilityLoadingId("");
    }
  };

  const openDeleteModal = (item) => {
    setDeleteItemId(item._id);
    setDeleteItemName(item.name || "");
    setDeleteError("");
    setDeleteSuccess("");
    setShowDeleteModal(true);
  };

  const handleDeleteMenuItem = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");
      setDeleteSuccess("");

      await api.delete(`/menu/${deleteItemId}`);

      setDeleteSuccess("Menu item deleted successfully.");
      setShowDeleteModal(false);
      setDeleteItemId("");
      setDeleteItemName("");
      await fetchMenuItems();
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete menu item.");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase();
    const matchesSearch =
      item.name?.toLowerCase().includes(text) ||
      item.description?.toLowerCase().includes(text);

    const matchesCategory = category ? item.category === category : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <style>{CSS}</style>
      <StaffHeader />
      <div className="menu-shell">
        <div className="menu-wrap menu-card">
          <div className="menu-head">
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div>
                <div className="menu-title">
                  <Soup size={24} color="#F5A623" />
                  Staff Menu
                </div>
                <div className="menu-sub">
                  View all main canteen menu items, categories, tags, prices, and availability.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddForm((prev) => !prev);
                  setAddError("");
                  setAddSuccess("");
                }}
                className="btn-gold"
              >
                {showAddForm ? "Close Form" : "Add Menu Item"}
              </button>
            </div>
          </div>

          <div className="toolbar">
            <div className="input-wrap">
              <span className="input-icon"><Search size={16} /></span>
              <input
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by item name or description"
              />
            </div>

            <div className="input-wrap">
              <span className="input-icon"><Filter size={16} /></span>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="rice_curry">Rice & Curry</option>
                <option value="kottu">Kottu</option>
                <option value="fried_rice">Fried Rice</option>
                <option value="additional_curries">Additional Curries</option>
                <option value="meats">Meats</option>
                <option value="chopsuey_sides">Chopsuey & Sides</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>
          </div>

          {error && <div className="msg error">{error}</div>}
          {availabilityError && <div className="msg error">{availabilityError}</div>}
          {deleteError && <div className="msg error">{deleteError}</div>}

          {addError && <div className="msg error">{addError}</div>}
          {addSuccess && (
            <div
              className="msg"
              style={{
                background: "rgba(34,197,94,.10)",
                border: "1px solid rgba(34,197,94,.22)",
                color: "#4ade80",
              }}
            >
              {addSuccess}
            </div>
          )}
          {editSuccess && (
            <div
              className="msg"
              style={{
                background: "rgba(34,197,94,.10)",
                border: "1px solid rgba(34,197,94,.22)",
                color: "#4ade80",
              }}
            >
              {editSuccess}
            </div>
          )}
          {deleteSuccess && (
            <div
              className="msg"
              style={{
                background: "rgba(34,197,94,.10)",
                border: "1px solid rgba(34,197,94,.22)",
                color: "#4ade80",
              }}
            >
              {deleteSuccess}
            </div>
          )}

          {showAddForm && (
            <form onSubmit={handleAddMenuItem} className="add-form">
              <div className="form-grid-2">
                <input
                  className="input form-input-plain"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => handleNewItemChange("name", e.target.value)}
                />
                <input
                  className="input form-input-plain"
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => handleNewItemChange("price", e.target.value)}
                />
              </div>

              <textarea
                className="input form-textarea"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => handleNewItemChange("description", e.target.value)}
              />

              <div className="form-grid-2">
                <select
                  className="select"
                  value={newItem.category}
                  onChange={(e) => handleNewItemChange("category", e.target.value)}
                >
                  <option value="rice_curry">Rice & Curry</option>
                  <option value="kottu">Kottu</option>
                  <option value="fried_rice">Fried Rice</option>
                  <option value="additional_curries">Additional Curries</option>
                  <option value="meats">Meats</option>
                  <option value="chopsuey_sides">Chopsuey & Sides</option>
                  <option value="beverages">Beverages</option>
                </select>

                <input
                  className="input form-input-plain"
                  placeholder="Tags (comma separated)"
                  value={newItem.tags}
                  onChange={(e) => handleNewItemChange("tags", e.target.value)}
                />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={newItem.isAvailable}
                  onChange={(e) => handleNewItemChange("isAvailable", e.target.checked)}
                />
                Available
              </label>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="btn-success"
                >
                  {addLoading ? "Adding..." : "Save Menu Item"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetNewItemForm();
                    setShowAddForm(false);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="menu-list">
            {loading ? (
              <div className="empty">Loading menu items...</div>
            ) : filteredItems.length === 0 ? (
              <div className="empty">No menu items found.</div>
            ) : (
              filteredItems.map((item) => (
                <div key={item._id} className="menu-item-card">
                  <div className="menu-top">
                    <div>
                      <div className="menu-name">{item.name}</div>
                      <div style={{ marginTop: "6px", fontSize: "13px", color: "rgba(255,255,255,.52)" }}>
                        {formatCategory(item.category)}
                      </div>
                    </div>

                    <div className="menu-meta">
                      <span className="pill">
                        <BadgeDollarSign size={13} />
                        Rs. {item.price}
                      </span>

                      <span className="pill">
                        {item.isAvailable ? <CircleCheck size={13} /> : <CircleOff size={13} />}
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="btn-gold"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <PencilLine size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item)}
                        disabled={availabilityLoadingId === item._id}
                        className={item.isAvailable ? "btn-secondary" : "btn-success"}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        {availabilityLoadingId === item._id
                          ? "Updating..."
                          : item.isAvailable
                          ? "Mark Unavailable"
                          : "Mark Available"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(item)}
                        className="btn-danger"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid">
                    <div className="mini">
                      <div className="mini-label">Category</div>
                      <div className="mini-value">{formatCategory(item.category)}</div>
                    </div>

                    <div className="mini">
                      <div className="mini-label">Price</div>
                      <div className="mini-value">Rs. {item.price}</div>
                    </div>

                    <div className="mini">
                      <div className="mini-label">Availability</div>
                      <div className="mini-value">{item.isAvailable ? "Available" : "Unavailable"}</div>
                    </div>

                    <div className="mini">
                      <div className="mini-label">Tags</div>
                      <div className="mini-value">
                        {item.tags?.length ? item.tags.join(", ") : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="desc-box">
                    <div className="desc-title">Description</div>
                    <div className="desc-text">{item.description || "—"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal-backdrop" onClick={() => {
          setShowDeleteModal(false);
          setDeleteItemId("");
          setDeleteItemName("");
        }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">Delete Menu Item</div>
                <div className="modal-sub">
                  This action will permanently remove the menu item from the staff menu.
                </div>
              </div>

              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteItemId("");
                  setDeleteItemName("");
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                padding: "14px 16px",
                borderRadius: "16px",
                background: "rgba(239,68,68,.08)",
                border: "1px solid rgba(239,68,68,.18)",
                color: "#fff",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Are you sure you want to delete <strong>{deleteItemName || "this menu item"}</strong>?
            </div>

            <div className="form-actions" style={{ marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteItemId("");
                  setDeleteItemName("");
                }}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteMenuItem}
                disabled={deleteLoading}
                className="btn-danger"
              >
                {deleteLoading ? "Deleting..." : "Delete Menu Item"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal-backdrop" onClick={() => { setShowEditModal(false); resetEditItemForm(); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">Edit Menu Item</div>
                <div className="modal-sub">
                  Update the item details, category, tags, price, and availability.
                </div>
              </div>

              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  setShowEditModal(false);
                  resetEditItemForm();
                }}
              >
                <X size={18} />
              </button>
            </div>

            {editError && <div className="msg error" style={{ margin: "0 0 12px", padding: "12px 14px" }}>{editError}</div>}

            <form onSubmit={handleEditMenuItem} className="add-form" style={{ margin: 0 }}>
              <div className="form-grid-2">
                <input
                  className="input form-input-plain"
                  placeholder="Item name"
                  value={editItem.name}
                  onChange={(e) => handleEditItemChange("name", e.target.value)}
                />
                <input
                  className="input form-input-plain"
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={editItem.price}
                  onChange={(e) => handleEditItemChange("price", e.target.value)}
                />
              </div>

              <textarea
                className="input form-textarea"
                placeholder="Description"
                value={editItem.description}
                onChange={(e) => handleEditItemChange("description", e.target.value)}
              />

              <div className="form-grid-2">
                <select
                  className="select"
                  value={editItem.category}
                  onChange={(e) => handleEditItemChange("category", e.target.value)}
                >
                  <option value="rice_curry">Rice & Curry</option>
                  <option value="kottu">Kottu</option>
                  <option value="fried_rice">Fried Rice</option>
                  <option value="additional_curries">Additional Curries</option>
                  <option value="meats">Meats</option>
                  <option value="chopsuey_sides">Chopsuey & Sides</option>
                  <option value="beverages">Beverages</option>
                </select>

                <input
                  className="input form-input-plain"
                  placeholder="Tags (comma separated)"
                  value={editItem.tags}
                  onChange={(e) => handleEditItemChange("tags", e.target.value)}
                />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={editItem.isAvailable}
                  onChange={(e) => handleEditItemChange("isAvailable", e.target.checked)}
                />
                Available
              </label>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="btn-success"
                >
                  {editLoading ? "Updating..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetEditItemForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}