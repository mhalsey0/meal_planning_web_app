import React, { useState } from 'react';
import './RecipeForm.css';

function RecipeForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    instructions: '',
    servingSize: ''
  });
  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: '', note: '' }
  ]);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (idx, e) => {
    const newIngredients = ingredients.map((ing, i) =>
      i === idx ? { ...ing, [e.target.name]: e.target.value } : ing
    );
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '', note: '' }]);
  };

  const removeIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    
    // Validate form
    if (!form.name.trim()) {
      setStatus('Error: Recipe name is required');
      return;
    }

    // Validate ingredients
    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity);
    if (validIngredients.length === 0) {
      setStatus('Error: At least one ingredient with name and quantity is required');
      return;
    }

    try {
      const requestData = {
        name: form.name,
        description: form.description,
        instructions: form.instructions,
        servingSize: form.servingSize,
        ingredients: validIngredients.map(ing => ({
          name: ing.name,
          quantity: parseFloat(ing.quantity) || 0,
          unit: ing.unit || '',
          note: ing.note || ''
        }))
      };

      console.log('Submitting recipe to /Recipe:', requestData);

      const response = await fetch('/Recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        credentials: 'include', // send cookies for auth
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('Recipe created:', result);
        setStatus('Recipe created successfully!');
        setForm({ name: '', description: '', instructions: '', servingSize: '' });
        setIngredients([{ name: '', quantity: '', unit: '', note: '' }]);
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        console.error('Response URL:', response.url);
        setStatus('Error: ' + errorText);
      }
    } catch (err) {
      console.error('Network error:', err);
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2 className="recipe-form-title">Create Recipe</h2>
      <div className="recipe-form-section">
        <input className="recipe-form-input" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="recipe-form-section">
        <textarea className="recipe-form-textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      </div>
      <div className="recipe-form-section">
        <textarea className="recipe-form-textarea" name="instructions" placeholder="Instructions" value={form.instructions} onChange={handleChange} />
      </div>
      <div className="recipe-form-section">
        <input className="recipe-form-input" name="servingSize" placeholder="Serving Size" value={form.servingSize} onChange={handleChange} />
      </div>
      <hr />
      <h3 className="recipe-form-subtitle">Ingredients</h3>
      {ingredients.map((ing, idx) => (
        <div key={idx} className="recipe-form-ingredient-row">
          <input
            className="recipe-form-input"
            name="name"
            placeholder="Name"
            value={ing.name}
            onChange={e => handleIngredientChange(idx, e)}
            required
          />
          <input
            className="recipe-form-input"
            name="quantity"
            placeholder="Qty"
            type="number"
            min="0"
            step="any"
            value={ing.quantity}
            onChange={e => handleIngredientChange(idx, e)}
            required
          />
          <input
            className="recipe-form-input"
            name="unit"
            placeholder="Unit"
            value={ing.unit}
            onChange={e => handleIngredientChange(idx, e)}
          />
          <input
            className="recipe-form-input"
            name="note"
            placeholder="Note"
            value={ing.note}
            onChange={e => handleIngredientChange(idx, e)}
          />
          <button type="button" onClick={() => removeIngredient(idx)} disabled={ingredients.length === 1} className="recipe-form-remove-btn">X</button>
        </div>
      ))}
      <button type="button" onClick={addIngredient} className="recipe-form-add-btn">Add Ingredient</button>
      <br />
      <button type="submit" className="recipe-form-submit-btn">Create</button>
      {status && <div className="recipe-form-status">{status}</div>}
    </form>
  );
}

export default RecipeForm;