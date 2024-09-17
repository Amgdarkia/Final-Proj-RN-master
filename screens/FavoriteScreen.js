import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FavoritesContext } from '../FavoritesContext';

export default function FavoriteScreen() {
    const { favorites, removeFavorite } = useContext(FavoritesContext);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const openModal = (guide) => {
        setSelectedGuide(guide);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedGuide(null);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favourites</Text>
            <FlatList
                data={favorites}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => openModal(item)} style={styles.cardContent}>
                            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                            <Text style={styles.language}>
                                Speaks: {Array.isArray(item.languages) ? item.languages.join(', ') : item.languages}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeFavorite(item)}>
                            <Icon name="times" size={20} color="#FF6347" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            {selectedGuide && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Guide Details</Text>
                            <Text style={styles.modalName}>{selectedGuide.firstName} {selectedGuide.lastName}</Text>
                            <Text style={styles.modalLanguage}>
                                Speaks: {Array.isArray(selectedGuide.languages) ? selectedGuide.languages.join(', ') : selectedGuide.languages}
                            </Text>
                            <Text style={styles.modalRating}>Rating: {selectedGuide.average_rating}/5</Text>
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
        color: '#FF6347',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    language: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalLanguage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    modalRating: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
