const SENTENCE_BANK = {
    easy: [
    "I like to practice typing every day.",
    "Typing is a useful computer skill.",
    "This is a simple sentence for beginners.",
    "I am learning to type faster.",
    "Practice helps improve your speed.",
    "I enjoy learning new skills online.",
    "The cat is sitting on the chair.",
    "We are using a keyboard to type.",
    "He reads a book every evening.",
    "She goes to school by bus.",
    "I wake up early in the morning.",
    "Typing games are fun and helpful.",
    "The sun rises in the east.",
    "Water is important for life.",
    "I drink water every day.",
    "The sky is very blue today.",
    "My computer is on the desk.",
    "I love listening to music.",
    "He plays football with friends.",
    "She writes in her notebook.",
    "The dog is running in the park.",
    "I have a small red bag.",
    "We are going to the market.",
    "It is a sunny day today.",
    "The birds are flying high.",
    "I eat breakfast every morning.",
    "My friend lives near my house.",
    "She is reading a story book.",
    "I like playing video games.",
    "The train is very fast.",
    "He drinks milk every night.",
    "I go to school with my sister.",
    "The flowers are very beautiful.",
    "We watch TV in the evening.",
    "The child is playing outside.",
    "I write with a blue pen.",
    "The phone is on the table.",
    "I like ice cream very much.",
    "The river is flowing slowly.",
    "She is wearing a red dress."
],

medium: [
    "JavaScript is widely used for building interactive websites that respond dynamically to user actions in real time.",
    "Frontend development focuses on designing and building the user interface of applications using HTML, CSS, and JavaScript.",
    "Backend systems are responsible for handling server-side logic, managing databases, and processing user requests efficiently.",
    "Consistent practice and dedication are essential for improving typing speed, accuracy, and overall keyboard efficiency over time.",
    "Developers use various frameworks and libraries to build modern applications that are scalable, maintainable, and efficient.",
    "Typing efficiently requires focus, correct finger placement, and regular practice to build muscle memory over time.",
    "Modern web applications rely heavily on APIs to communicate between frontend interfaces and backend services seamlessly.",
    "Databases are used to store, organize, and manage large volumes of structured and unstructured data efficiently.",
    "Programming involves logical thinking, problem-solving skills, and the ability to break complex problems into smaller parts.",
    "Software development includes planning, designing, coding, testing, and maintaining applications throughout their entire lifecycle.",
    "Cloud computing enables users to access computing resources like storage and servers over the internet on demand.",
    "Web development includes both frontend and backend technologies that work together to create complete web applications.",
    "Debugging is an important process in programming where developers identify and fix errors or unexpected behavior in code.",
    "Good developers write clean, readable, and maintainable code that can be easily understood and modified by others.",
    "React is a popular JavaScript library used for building fast and interactive user interfaces for web applications.",
    "Node.js allows developers to run JavaScript on the server side, enabling full-stack development using a single language.",
    "APIs act as bridges between different software systems, allowing them to communicate and exchange data efficiently.",
    "Authentication systems ensure that only authorized users can access certain parts of an application or system securely.",
    "Version control systems like Git help developers track changes in code and collaborate effectively in teams.",
    "Learning to code requires patience, consistency, and continuous practice to build strong problem-solving abilities.",
    "Data structures help organize and store data efficiently so that it can be accessed and modified quickly when needed.",
    "Algorithms provide step-by-step instructions to solve problems and are evaluated based on efficiency and performance.",
    "Operating systems manage hardware resources and provide a platform for running applications smoothly and efficiently.",
    "Networking allows computers to communicate with each other using protocols like TCP/IP for reliable data transfer.",
    "Artificial intelligence enables machines to perform tasks that typically require human intelligence such as decision making.",
    "Machine learning helps systems learn from data and improve performance without being explicitly programmed for every task.",
    "Cybersecurity is essential for protecting digital systems from threats like hacking, malware, and unauthorized access.",
    "Encryption is used to secure sensitive data by converting it into a coded format that only authorized users can read.",
    "Load balancing distributes traffic across multiple servers to ensure no single server becomes overloaded with requests.",
    "Caching improves performance by storing frequently accessed data in faster storage for quicker retrieval in applications.",
    "Containerization helps developers package applications with all dependencies so they run consistently across different environments.",
    "DevOps combines development and operations to automate software delivery and improve collaboration between teams.",
    "Big data analytics processes large datasets to find patterns, trends, and useful insights for business decision making.",
    "System design involves planning the architecture of software systems to ensure scalability, reliability, and efficiency.",
    "Software testing ensures that applications work correctly by identifying bugs and verifying expected behavior.",
    "Object-oriented programming organizes code using classes and objects to improve modularity and reusability.",
    "Compilers translate high-level programming languages into machine code that computers can execute efficiently.",
    "Interpreters execute code line by line, making debugging easier but often slower than compiled languages.",
    "User interface design focuses on creating visually appealing and user-friendly layouts for better user experience.",
    "Automation reduces manual work by using technology to perform repetitive tasks efficiently and accurately."
],

   hard: [
    "Asynchronous programming allows tasks to execute independently without blocking the main execution thread, which is essential in modern web applications that rely heavily on network requests, database queries, and file operations. By using mechanisms such as promises, callbacks, and async/await, developers can write cleaner and more manageable code while improving application responsiveness.",

    "Microservices architecture breaks down a large application into smaller, independent services that communicate through APIs or messaging systems. Each service handles a specific business function and can be developed, deployed, and scaled separately, making the system more flexible and maintainable while introducing challenges in coordination and monitoring.",

    "Cybersecurity involves protecting systems, networks, and data from unauthorized access, attacks, and damage. It includes techniques such as encryption, authentication, intrusion detection, and secure coding practices, all of which are necessary to defend against evolving threats like ransomware, phishing, and malware attacks.",

    "Database normalization is a structured process of organizing relational database tables to reduce redundancy and improve data integrity. It involves splitting large tables into smaller related ones and defining relationships using keys, although excessive normalization may lead to complex queries and performance trade-offs.",

    "Machine learning enables systems to learn patterns from data and improve performance without being explicitly programmed. It includes supervised, unsupervised, and reinforcement learning techniques, and is widely used in applications such as recommendation systems, fraud detection, and predictive analytics.",

    "Cloud computing provides on-demand access to computing resources such as servers, storage, and networking over the internet. It eliminates the need for physical infrastructure and allows businesses to scale resources dynamically, reducing costs and increasing operational flexibility.",

    "Full stack development involves working on both frontend and backend components of an application. Frontend focuses on user interfaces using HTML, CSS, and JavaScript, while backend handles logic, authentication, and database operations, requiring a strong understanding of system integration.",

    "System design focuses on creating scalable, reliable, and efficient software architectures. It requires understanding trade-offs between performance, consistency, and availability, especially in large-scale systems like social media platforms or e-commerce applications serving millions of users.",

    "Concurrency allows multiple processes to execute simultaneously within a program, improving efficiency but introducing challenges such as race conditions and deadlocks. Proper synchronization techniques like locks and semaphores are required to ensure safe execution.",

    "DevOps integrates software development and IT operations to enable continuous integration and continuous delivery. It emphasizes automation, monitoring, and collaboration, allowing faster deployment cycles and more reliable software releases.",

    "Distributed systems consist of multiple independent machines working together as a single system. They face challenges like network latency, partial failures, and data consistency, which are managed using replication, sharding, and consensus algorithms.",

    "API design defines how different software systems communicate with each other. Well-designed APIs follow principles such as simplicity, consistency, and versioning, with REST and GraphQL being widely used approaches in modern development.",

    "Performance optimization focuses on improving system speed and efficiency by reducing latency and resource usage. Techniques like caching, indexing, and load balancing help enhance responsiveness and scalability in large applications.",

    "Containerization packages applications and their dependencies into isolated environments called containers. Tools like Docker ensure consistency across development, testing, and production environments, reducing deployment issues.",

    "Big data analytics processes large datasets to extract meaningful insights and patterns. It uses distributed frameworks like Hadoop and Spark to handle structured and unstructured data for decision-making and predictive modeling.",

    "Software testing ensures that applications function correctly and meet requirements. It includes unit testing, integration testing, and system testing, each designed to identify bugs and improve software reliability.",

    "Object-oriented programming is a paradigm based on classes and objects, promoting concepts such as inheritance, encapsulation, and polymorphism. It helps in building modular and reusable code structures.",

    "Operating systems manage hardware and software resources in a computer system. They handle processes, memory management, file systems, and device control to ensure smooth execution of applications.",

    "Networking enables communication between devices through protocols such as TCP/IP. It involves concepts like routing, switching, and packet transmission to ensure reliable data transfer across systems.",

    "Artificial intelligence focuses on creating systems that can perform tasks requiring human intelligence, such as reasoning, learning, and decision-making. It powers applications like chatbots, recommendation systems, and autonomous vehicles.",

    "Data structures are ways of organizing and storing data efficiently. Common structures like arrays, linked lists, stacks, and queues help optimize access and manipulation of data in algorithms.",

    "Algorithms are step-by-step procedures used to solve computational problems. They are evaluated based on time complexity and space complexity, which determine their efficiency in processing data.",

    "Version control systems track changes in source code over time, enabling collaboration among developers. Tools like Git allow branching, merging, and rollback of changes in software projects.",

    "Web development involves building websites and web applications using technologies like HTML, CSS, JavaScript, and backend frameworks. It requires understanding both client-side and server-side development.",

    "Authentication verifies the identity of a user, while authorization determines what resources they can access. These mechanisms are essential for securing applications and protecting sensitive data.",

    "Encryption converts data into a secure format that can only be read with a decryption key. It is widely used to protect sensitive information during transmission and storage.",

    "Load balancing distributes incoming network traffic across multiple servers to ensure reliability and performance. It prevents any single server from becoming overwhelmed by requests.",

    "Caching improves system performance by storing frequently accessed data in faster storage. This reduces the need to repeatedly fetch data from slower backend systems.",

    "Search engines use complex algorithms to index and retrieve information from vast amounts of data on the internet. They rank results based on relevance, authority, and user behavior.",

    "Compilers translate high-level programming languages into machine code that computers can execute. They perform tasks like syntax analysis, optimization, and code generation.",

    "Interpreters execute code line by line without compiling it into machine code beforehand. This allows faster testing but may result in slower execution compared to compiled languages.",

    "Artificial neural networks are inspired by the human brain and consist of layers of interconnected nodes. They are used in deep learning applications like image recognition and natural language processing.",

    "Blockchain technology is a decentralized system that records transactions across multiple computers securely. It ensures transparency and immutability, making it useful for cryptocurrencies and secure data sharing.",

    "Edge computing processes data closer to the source rather than relying on centralized servers. This reduces latency and improves performance for real-time applications.",

    "Software architecture defines the structure and organization of a software system. It determines how components interact and how scalability, performance, and maintainability are achieved.",

    "User interface design focuses on creating intuitive and visually appealing layouts for applications. It emphasizes usability, accessibility, and user experience principles.",

    "Data mining involves extracting useful patterns and knowledge from large datasets. It uses statistical and machine learning techniques to discover hidden relationships in data.",

    "Automation reduces manual effort by using software or machines to perform repetitive tasks. It increases efficiency and reduces the likelihood of human error in processes.",

    "System reliability ensures that software performs consistently under expected conditions without failure. It involves redundancy, fault tolerance, and continuous monitoring techniques."
]
};