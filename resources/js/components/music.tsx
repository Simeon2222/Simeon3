import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from '@inertiajs/react';

interface Music {
    id: number;
    title: string;
    filename: string; 
}

const MusicList: React.FC = () => {
    const [music, setMusic] = useState<Music[]>([]);
    const [form, setForm] = useState<{ id: number; title: string; file: File | null }>({
        id: 0,
        title: '',
        file: null,
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Fetch Music List
    const fetchMusic = async () => {
        try {
            const response = await fetch('/music', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMusic(data.music); // expects { music: [...] }
            } else {
                console.error('Failed to fetch music');
            }
        } catch (error) {
            console.error('Error fetching music:', error);
        }
    };

    useEffect(() => {
        fetchMusic();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'file' && files) {
            setForm({ ...form, file: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // Add Music
    const handleAddMusic = async () => {
        if (!form.file) {
            alert("Please select an audio file");
            return;
        }

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('file', form.file);

        try {
            const response = await fetch('/music', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: formData,
            });

            if (response.ok) {
                await fetchMusic();
            } else {
                console.error('Failed to upload music');
            }
        } catch (error) {
            console.error('Error uploading music:', error);
        }

        setForm({ id: 0, title: '', file: null });
    };

    // Edit
    const handleEdit = (item: Music) => {
        setEditingId(item.id);
        setForm({ id: item.id, title: item.title, file: null });
    };

    // Update
    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('title', form.title);
        if (form.file) {
            formData.append('file', form.file);
        }

        try {
            const response = await fetch(`/music/${form.id}`, {
                method: 'POST', // for Laravel use PUT override
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: formData,
            });

            if (response.ok) {
                await fetchMusic();
                setEditingId(null);
            } else {
                console.error('Failed to update music');
            }
        } catch (error) {
            console.error('Error updating music:', error);
        }

        setForm({ id: 0, title: '', file: null });
    };

    // Delete
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/music/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            if (response.ok) {
                await fetchMusic();
            } else {
                console.error('Failed to delete music');
            }
        } catch (error) {
            console.error('Error deleting music:', error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.linkContainer}>
                <Link href="/dashboard" style={styles.dashboardButton}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            <h1 style={styles.header}>Music Library</h1>

            <div style={styles.formContainer}>
                <input
                    type="text"
                    name="title"
                    placeholder="Song Title"
                    value={form.title}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="file"
                    name="file"
                    accept="audio/*"
                    onChange={handleInputChange}
                    style={styles.input}
                />

                {editingId ? (
                    <button onClick={handleUpdate} style={styles.button}>Update Song</button>
                ) : (
                    <button onClick={handleAddMusic} style={styles.button}>Add Song</button>
                )}
            </div>

            <ul style={styles.notesList}>
                {music.map((item) => (
                    <li key={item.id} style={styles.noteItem}>
                        <h3 style={styles.noteTitle}>{item.title}</h3>

                        <audio controls style={{ width: "100%" }}>
                            <source src={`/storage/music/${item.filename}`} />
                        </audio>

                        <div style={styles.noteActions}>
                            <button onClick={() => handleEdit(item)} style={styles.editButton}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)} style={styles.deleteButton}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '700px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    linkContainer: {
        marginBottom: '20px',
    },
    dashboardButton: {
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#007BFF',
        textDecoration: 'none',
        borderRadius: '5px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    header: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    notesList: {
        listStyle: 'none',
        padding: '0',
    },
    noteItem: {
        backgroundColor: '#fff',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginBottom: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    noteTitle: {
        margin: '0 0 5px',
        color: '#333',
        fontWeight: 'bold',
    },
    noteActions: {
        display: 'flex',
        gap: '10px',
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#FFC107',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#DC3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default MusicList;
