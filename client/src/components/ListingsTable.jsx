import { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from './DataTable';
import UpdateListingForm from './UpdateListingForm';
import { useSelector } from 'react-redux';

const ListingsTable = ({ listings }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState(listings);
  const [editingListing, setEditingListing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    {
      key: 'image',
      title: 'Imagen',
      render: (listing) => (
        <Link to={`/listing/${listing._id}`} className="shrink-0">
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="h-16 w-16 object-cover rounded-md"
          />
        </Link>
      ),
    },
    {
      key: 'name',
      title: 'Nombre',
      render: (listing) => (
        <Link
          className="text-slate-700 font-medium hover:text-slate-900"
          to={`/listing/${listing._id}`}
        >
          {listing.name}
        </Link>
      ),
    },
    {
      key: 'type',
      title: 'Tipo',
    },
    {
      key: 'address',
      title: 'Dirección',
    },
    {
      key: 'price',
      title: 'Precio',
      render: (listing) => `$${listing.regularPrice}`,
    },
  ];

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleListingDelete = async (listing) => {
    try {
      const res = await fetch(`/api/listing/delete/${listing._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listingA) => listingA._id !== listing._id)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateSuccess = (updatedListing) => {
    setUserListings(prev => 
      prev.map(listing => 
        listing._id === updatedListing._id ? updatedListing : listing
      )
    );
    setShowForm(false);
    setEditingListing(null);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingListing(null);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        {showForm ? 'Editar listado' : 'Sus listados'}
      </h2>
      
      {showForm ? (
        <div>
          <button
            onClick={handleCancelEdit}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a la lista
          </button>
          <UpdateListingForm 
            listing={editingListing} 
            currentUser={currentUser}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={userListings}
          onEdit={handleEdit}
          onDelete={handleListingDelete}
          pagination={true}
          itemsPerPage={5}
        />
      )}
    </div>
  );
};

export default ListingsTable;