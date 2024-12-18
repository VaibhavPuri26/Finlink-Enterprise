import  { useState } from "react";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/getToken"
export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    registered: "",
    color:"",
    kmsDriven:0,
    condition:"",
    owner:"",
    year: 2024,
    description: "",
    fuelType: "petrol",
    price: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 10) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 10 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (
      e.target.value === "petrol" ||
      e.target.value === "diesel" ||
      e.target.value === "electric" ||
      e.target.value === "hybrid"
    ) {
      setFormData({
        ...formData,
        fuelType: e.target.value,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" 
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least 1 image");
      setLoading(true);
      setError(false);
      const res = await fetch("https://finlink-enterprise.onrender.com/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <main className="p3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          ></input>
          <input
            type="text"
            placeholder="Registered Location"
            className="border p-3 rounded-lg"
            id="registered"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.registered}
          ></input>
          <input
            type="text"
            placeholder="Color"
            className="border p-3 rounded-lg"
            id="color"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.color}
          ></input>
          <input
            type="text"
            placeholder="Condition"
            className="border p-3 rounded-lg"
            id="condition"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.condition}
          ></input>
          <input
            type="text"
            placeholder="Owner"
            className="border p-3 rounded-lg"
            id="owner"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.owner}
          ></input>
         
          <input
            type="number"
            placeholder="Year"
            className="border p-3 rounded-lg"
            id="year"
            required
            min="2010"
            max="2024"
            onChange={handleChange}
            value={formData.year}
          ></input>
          <input
            type="number"
            placeholder="Kms Driven"
            className="border p-3 rounded-lg"
            id="kmsDriven"
            required
            min="0"
            max="2000000"
            onChange={handleChange}
            value={formData.kmsDriven}
          ></input>
          <select
            id="FuelType"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChange}
            value={formData.fuelType}
          >
            <option value="fuel">Choose a Fuel Type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="price"
              min="1000"
              max="100000000"
              required
              className="p-3 border border-gray-300  rounded-lg"
              onChange={handleChange}
              value={formData.price}
            />
              <span className="text-xs">(₹)</span>
            <div className="flex flex-col items-center">
              <p>Price</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              id="images"
              accept="image/*"
              multiple
              type="file"
              className="w-full rounded-lg border border-input bg-white p-3 text-sm text-gray-500 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-500 border rounded-lg border-green-700 hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center rounded-lg"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg upp hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="relative p-3 text-center py-2.5 px-8 text-black text-base font-bold  rounded-[50px] overflow-hidden bg-white transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-emerald-100 before:to-emerald-600 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0 ">
            Create Listing
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
