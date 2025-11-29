# 🔄 Sequence Detector Visualizer

An interactive web application for visualizing Mealy and Moore state machines for binary sequence detection.

![Sequence Detector](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🎨 **Beautiful UI** - Premium dark theme with glassmorphism effects
- 🔄 **Dual Machine Types** - Support for both Mealy and Moore state machines
- 🎯 **Overlap Detection** - Toggle between overlapping and non-overlapping modes
- 📊 **Interactive Visualization** - Step-by-step state transitions with animations
- 🎭 **Real-time Testing** - Test any binary sequence against your detector
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Live Demo

[View Live Demo](#) *(Link will be added after deployment)*

## 🎮 How to Use

1. **Choose Machine Type**: Select Mealy or Moore
2. **Set Overlap Mode**: Choose overlapping or non-overlapping detection
3. **Enter Pattern**: Input the binary pattern you want to detect (e.g., `101`)
4. **Generate**: Click "Generate State Machine" to visualize the state diagram
5. **Test**: Enter a test sequence and click "Run Test"
6. **Navigate**: Use Next/Previous buttons or click on steps to see transitions

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern features (Grid, Flexbox, Animations)
- **Vanilla JavaScript** - Logic and interactivity
- **SVG** - State diagram rendering
- **Google Fonts** - Typography (Outfit)

## 📦 Installation

No installation required! Just open `index.html` in a modern web browser.

For local development:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sequence-detector-visualizer.git

# Navigate to directory
cd sequence-detector-visualizer

# Open in browser
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

## 🎯 Examples

### Example 1: Detect "101"
- **Pattern**: `101`
- **Test Input**: `110101`
- **Result**: Found at positions 4, 6 (overlapping mode)

### Example 2: Detect "1001"
- **Pattern**: `1001`
- **Test Input**: `1001001`
- **Result**: Found at positions 1, 4 (overlapping mode)

## 🏗️ Project Structure

```
sequence-detector-visualizer/
├── index.html          # Main HTML file
├── style.css           # Styling and animations
├── script.js           # State machine logic
├── DEPLOYMENT.md       # Deployment guide
└── README.md           # This file
```

## 🎨 Features in Detail

### State Machine Generation
- Automatically generates states based on pattern length
- Calculates transitions for both 0 and 1 inputs
- Handles both Mealy and Moore machine types

### Visualization
- Clean "Highway" layout for easy understanding
- Color-coded states (start, active, visited)
- Animated transitions with flowing effects
- Pulsing active state indicator

### Testing
- Step-by-step execution
- Visual highlighting of current state and transition
- Detection markers for pattern matches
- Navigation controls (Next, Previous, Reset)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ratul**

## 🙏 Acknowledgments

- Inspired by digital logic design and automata theory
- Built with modern web technologies
- Designed for educational purposes

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for learning and visualization**
