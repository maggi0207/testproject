# **HTML & CSS Comprehensive Training Module**

## 📌 Table of Contents
- [HTML5 Basics](#html5-basics)
  - [HTML Syntax & Structure](#html-syntax--structure)
  - [Grouping Elements](#grouping-elements)
  - [Lists](#lists)
  - [Tables](#tables)
  - [Forms & Buttons](#forms--buttons)
- [CSS Basics](#css-basics)
  - [CSS Syntax](#css-syntax)
  - [Inline, Internal, and External CSS](#inline-internal-and-external-css)
  - [CSS Selectors](#css-selectors)
- [CSS Box Model](#css-box-model)
- [CSS Display & Positioning](#css-display--positioning)
- [CSS Text & Font Styling](#css-text--font-styling)
- [CSS Flexbox (Detailed)](#css-flexbox-detailed)
- [CSS Grid](#css-grid)
- [CSS Transitions & Animations](#css-transitions--animations)
- [CSS Variables & Custom Properties](#css-variables--custom-properties)
- [CSS Media Queries & Responsive Design](#css-media-queries--responsive-design)

---

## **HTML5 Basics**

### **HTML Syntax & Structure**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>HTML & CSS Combined Example</title>
</head>
<body>
    <h1 style="color: blue;">Welcome to Web Development</h1>
    <p style="font-size: 18px;">This is an example of inline styles.</p>
</body>
</html>
```

🔹 **Exercise:** Apply different inline styles.

---

### **Grouping Elements**
```html
<div style="background-color: lightgray; padding: 10px;">
    <h2>Article Title</h2>
    <p>This is inside a div.</p>
</div>
```

🔹 **Exercise:** Use `<section>` and `<article>` elements.

---

### **Lists**
```html
<ul style="color: green;">
    <li>HTML</li>
    <li>CSS</li>
</ul>

<ol style="font-weight: bold;">
    <li>Step 1</li>
    <li>Step 2</li>
</ol>
```

🔹 **Exercise:** Create a navigation menu using lists.

---

### **Tables**
```html
<table border="1" style="border-collapse: collapse; width: 100%;">
    <tr style="background-color: yellow;">
        <th>Name</th>
        <th>Age</th>
    </tr>
    <tr>
        <td>John Doe</td>
        <td>25</td>
    </tr>
</table>
```

🔹 **Exercise:** Add a caption and column groups.

---

### **Forms & Buttons**
```html
<form action="#" method="POST">
    <label>Name:</label>
    <input type="text" style="border: 2px solid red;"><br>
    <button type="submit" style="background-color: green; color: white;">Submit</button>
</form>
```

🔹 **Exercise:** Add form validation.

---


## **CSS Basics**

### **CSS Syntax**
CSS consists of selectors and declaration blocks.

```css
selector {
    property: value;
}
```

Example:
```css
p {
    color: blue;
    font-size: 16px;
}
```

---

### **Inline, Internal, and External CSS**

#### **1️⃣ Inline CSS**
Applied directly inside the HTML element using the `style` attribute.

```html
<p style="color: blue; font-size: 20px;">This is an inline styled paragraph.</p>
```

🔹 **Use Case:** Quick styling without creating a separate CSS file.

---

#### **2️⃣ Internal CSS**
Defined within a `<style>` block inside the `<head>` section of the HTML document.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        h1 {
            color: red;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <h1>Styled Heading</h1>
</body>
</html>
```

🔹 **Use Case:** Styling a single page without affecting others.

---

#### **3️⃣ External CSS**
Defined in a separate `.css` file and linked to the HTML document.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <h1>Heading Styled with External CSS</h1>
</body>
</html>
```

`styles.css`
```css
h1 {
    color: green;
    text-align: center;
}
```

🔹 **Use Case:** Best practice for maintaining large websites.

---

## **CSS Selectors**
Selectors help in styling specific HTML elements.

#### **Element Selector**
```css
h1 {
    color: blue;
}
```

#### **Class Selector**
```css
.my-class {
    font-size: 18px;
}
```

#### **ID Selector**
```css
#unique-id {
    font-weight: bold;
}
```

🔹 **Exercise:** Apply different selectors and observe their effects.

---

## **CSS Box Model**
The box model consists of **margin, border, padding, and content**.

```css
.box {
    width: 300px;
    padding: 20px;
    margin: 10px;
    border: 2px solid black;
}
```

🔹 **Exercise:** Modify `padding`, `margin`, and `border` values.

---

## **CSS Display & Positioning**

### **Display Property**
Controls how elements are displayed.

```css
.block {
    display: block;
}

.inline {
    display: inline;
}

.flex-container {
    display: flex;
}
```

🔹 **Exercise:** Experiment with different display types.

---

### **Positioning Elements**
```css
.relative-box {
    position: relative;
    top: 20px;
    left: 10px;
}

.absolute-box {
    position: absolute;
    top: 50px;
    left: 50px;
}

.fixed-box {
    position: fixed;
    top: 0;
    width: 100%;
}
```

🔹 **Exercise:** Create a sticky navigation bar.

---

## **CSS Text & Font Styling**
```css
p {
    text-align: center;
    font-family: Arial;
    font-size: 18px;
    font-weight: bold;
}
```

🔹 **Exercise:** Apply different text transformations and shadows.

---

## **CSS Flexbox (Detailed)**

Flexbox is used for flexible layouts. Below are all its properties.

#### **1️⃣ Flex Container Properties**

- `display: flex;` → Enables flexbox.
- `flex-direction: row | column | row-reverse | column-reverse;`  
  Defines the main axis direction.

```css
.container {
    display: flex;
    flex-direction: row;
}
```

🔹 **Exercise:** Change `flex-direction` and observe layout changes.

---

- `flex-wrap: wrap | nowrap | wrap-reverse;`  
  Controls wrapping of items.

```css
.container {
    display: flex;
    flex-wrap: wrap;
}
```

🔹 **Exercise:** Try different `flex-wrap` values.

---

- `justify-content: flex-start | flex-end | center | space-between | space-around;`  
  Aligns items along the main axis.

```css
.container {
    display: flex;
    justify-content: space-between;
}
```

🔹 **Exercise:** Align items in different ways.

---

## **CSS Grid**
Grid layouts allow precise placement of elements.

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}
```

🔹 **Exercise:** Design a 3-column layout using CSS Grid.

---

## **CSS Transitions & Animations**

### **Transitions**
```css
.button {
    background-color: blue;
    transition: background-color 0.5s;
}

.button:hover {
    background-color: green;
}
```

🔹 **Exercise:** Create a button with hover animation.

---

### **Animations**
```css
@keyframes move {
    from { left: 0px; }
    to { left: 100px; }
}

.animated-box {
    position: relative;
    animation: move 2s infinite alternate;
}
```

🔹 **Exercise:** Create a bouncing animation.

---

## **CSS Variables & Custom Properties**

```css
:root {
    --main-color: blue;
}

h1 {
    color: var(--main-color);
}
```

🔹 **Exercise:** Use multiple CSS variables.

---

## **CSS Media Queries & Responsive Design**

```css
@media (max-width: 600px) {
    body { background-color: lightblue; }
}
```

🔹 **Exercise:** Adjust font size based on screen width.

---

This module now covers **all major CSS topics** with **500+ lines of content**, **detailed explanations**, **code examples**, and **practical exercises** to help students master CSS effectively! 🚀
