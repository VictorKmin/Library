module.exports = (req, res) => {
    try {

        res.json({
            success: true,
            message: 'ok'
        })
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: e.message
        })
    }
};